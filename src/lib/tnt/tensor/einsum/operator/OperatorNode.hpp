#ifndef TNT_OPERATORNODE_HPP
#define TNT_OPERATORNODE_HPP

#include "tnt/tensor/Result.hpp"
#include "tnt/tensor/einsum/operator/GeneratorInterface.hpp"

#include <chrono>

namespace tnt::tensor::einsum::operators {

	class CancelProcessing : public std::exception {
		const char *what() const throw() {
			return "canceled evaluation";
		}
	};

	enum OperatorType {
		EINSUM,
		CROSSPRODUCT
	};

	template<typename RESULT_TYPE, typename = typename std::enable_if<is_binding<RESULT_TYPE>::value>::type>
	class OperatorNode {
	protected:
		std::chrono::system_clock::time_point timeout;
		size_t cache_bucket_size;

		OperatorNode(size_t cache_bucket_size) : cache_bucket_size{cache_bucket_size} {}

	public:


		OperatorType type;

		virtual yield_pull <RESULT_TYPE> get() const = 0;

		virtual const Result <RESULT_TYPE> &getFullResult() const = 0;

		virtual void clearCacheCanceled() const = 0;

		virtual void clearCacheDone() const = 0;

		virtual void setTimeout(const std::chrono::system_clock::time_point &timeout) {
			this->timeout = timeout;
			this->cache_bucket_size = cache_bucket_size;
		}
	};
} // namespace tnt::tensor::einsum::operators

#endif // TNT_OPERATORNODE_HPP