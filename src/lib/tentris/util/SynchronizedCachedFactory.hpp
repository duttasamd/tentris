#ifndef TENTRIS_CACHE_HPP
#define TENTRIS_CACHE_HPP

#include <unordered_map>
#include <memory>
#include <list>
#include <mutex>
#include <exception>

namespace tentris::util::sync {
	/**
	 * Provides a factory for instances of V. V must provide a constructor awaiting a single argument of type V.
	 * @tparam K key type. K is the type of a unique identifer of V.
	 * @tparam V V is the type that is instanciated by the factory.
	 */
	template<typename K, typename V>
	class SynchronizedCachedFactory {
	protected:
		struct Entry {
			Entry(const K &key, const std::shared_ptr<V> &value) : key(key), value(value) {}

			Entry(const K &key, V *value)
					: key{key}, value{value} {}

			K key;
			std::shared_ptr<V> value;
		};

		using LruList = std::list<Entry>;
		using LruList_iter = typename std::list<Entry>::iterator;

		/**
		 * Mutex to protect access to _lru_list and _cache
		 */
		std::mutex _cache_mutex;
		/**
		 * Capacity of this Factory.
		 */
		size_t _capacity;
		/**
		 * entries (key and value) ordered by least recently used.
		 */
		LruList _lru_list;
		/**
		 * mapping from key to the position in _lru_list
		 */
		std::unordered_map<K, LruList_iter> _key_to_pos;

		/**
		 * Checks weather a key is contained and returns a iterator pointing to the corresponding entry.
		 * <br/>
		 * The call of this function must be guarded by _cache_mutex.
		 * @param key key to a entry
		 * @return tuple (is in cache)
		 */
		std::tuple<bool, LruList_iter> unsynced_contains(const K &key) const {
			if (_key_to_pos.count(key)) {
				LruList_iter pos = _key_to_pos.at(key);
				return {true, pos};
			} else {
				return {false, {}};
			}
		}

		/**
		 * Erases the element that wasn't use for the longest time.
		 * <br/>
		 * The call of this function must be guarded by _cache_mutex.
		 */
		void unsynced_popLeastRecentlyUsed() {
			_key_to_pos.erase(_lru_list.back().key);
			_lru_list.pop_back();
		}

		/**
		 * Makes the entry that entry_pos points to the latest. entry_pos is not checked and must be valid.
		 * <br/>
		 * The call of this function must be guarded by _cache_mutex.
		 * @param entry_pos pointer to an entry. It is updated in the process and stays valid.
		 */
		void unsafe_makeLatest(LruList_iter &entry_pos) {
			// move it to the front
			_lru_list.splice(_lru_list.begin(), _lru_list, entry_pos);
			// update the mapper
			entry_pos = _lru_list.begin();
			_key_to_pos[entry_pos->key] = entry_pos;
		}


		/**
		 * This method constructs a value from a given key. This must be implemented manually for every
		 * specialization of this template. <n />
		 * When called internally by the SynchronizedFactory the return value is wrapped into a std::shared_pointer. Thus
		 * the user is not responsible for destructing the return value manually.
		 * @param key key to construct value for
		 * @return pointer to newly constructed value. The caller is in care of destructing the value.
		 */
		virtual V *construct(const K &key) = 0;

	public:
		explicit SynchronizedCachedFactory(size_t capacity = 500) : _capacity{capacity} {}

		size_t size() const {
			std::lock_guard{_cache_mutex};
			return _key_to_pos.size();
		}

		/**
		 * Get a std::shared_pointer to a cached resource. The resource is not guaranteed to be in the cache at any time
		 * after calling this method. So keep its std::shared_pointer or it may be destructed.
		 * @param key key to the resource
		 * @return the resource for the key
		 * @throw std::invalid_argument it was not possible to construct a value for the key
		 */
		std::shared_ptr<V> get(const K &key) {
			std::lock_guard{_cache_mutex};

			if (auto &&[contains, lru_iter] = unsynced_contains(key); contains) {
				unsafe_makeLatest(lru_iter);
				return lru_iter->value;
			} else {
				if (_lru_list.size() >= _capacity)
					unsynced_popLeastRecentlyUsed();
				V *new_value = construct(key);
				if (new_value == nullptr)
					throw std::invalid_argument("Key was not valid.");
				_lru_list.push_front({key, new_value});
				lru_iter = _lru_list.begin();
				_key_to_pos[lru_iter->key] = lru_iter;
				return lru_iter->value;
			}
		}
	};
}
#endif //TENTRIS_CACHE_HPP
