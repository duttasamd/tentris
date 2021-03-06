#include <gtest/gtest.h>

#include <tentris/tensor/hypertrie/BoolHyperTrie.hpp>
#include <tentris/util/FmtHelper.hpp>


using namespace tentris::util::types;
using namespace tentris::tensor::hypertrie;

TEST(TestBoolHyperTrie, test_single_write_read0) {

    Key_t key{5};
    bool value = true;

    BoolHyperTrie trie{uint8_t(key.size())};

    trie.set(key, value);

    std::variant<BoolHyperTrie *, bool> stored_value_ = trie.get(key);

    bool stored_value = std::get<bool>(stored_value_);
    ASSERT_EQ(stored_value, value);
}

TEST(TestBoolHyperTrie, test_single_write_read1) {

    Key_t key{5, 10, 8};
    bool value = 1;

    BoolHyperTrie trie{uint8_t(key.size())};

    trie.set(key, value);

    std::variant<BoolHyperTrie *, bool> stored_value_ = trie.get(key);

    bool stored_value = std::get<bool>(stored_value_);
    ASSERT_EQ(stored_value, value);
}

TEST(TestBoolHyperTrie, test_double_write_read0) {
    // data
    Key_t key{5, 10, 8};
    bool value = true;

    // init
    BoolHyperTrie trie{uint8_t(key.size())};

    // load data
    trie.set(key, value);
    trie.set(key, value);

    // validate
    std::variant<BoolHyperTrie *, bool> stored_value_ = trie.get(key);

    bool stored_value = std::get<bool>(stored_value_);
    ASSERT_EQ(stored_value, value);
}

TEST(TestBoolHyperTrie, test_mult_write_read1) {
    // data
    std::vector<Key_t> keys{
            {0, 10, 8},
            {0, 10, 9}
    };
    bool value = true;

    uint8_t key_length = 3;

    // init
    BoolHyperTrie trie{key_length};

    // load data
    for (unsigned int i = 0; i < keys.size(); ++i) {
        Key_t &key = keys[i];

        trie.set(key, value);
    }

    // validate
    for (unsigned int i = 0; i < keys.size(); ++i) {
        Key_t &key = keys[i];

        std::variant<BoolHyperTrie *, bool> stored_value_ = trie.get(key);

        bool stored_value = std::get<bool>(stored_value_);
        ASSERT_EQ(stored_value, value);
    }
}

TEST(TestBoolHyperTrie, test_read_full_slice) {
    Key_t key{5, 10, 8};
    bool value = true;

    BoolHyperTrie trie{uint8_t(key.size())};

    trie.set(key, value);

    Key_t empty_key{};

    std::variant<BoolHyperTrie *, bool> stored_value_ = trie.get(key);

    bool stored_value = std::get<bool>(stored_value_);
    ASSERT_EQ(stored_value, value);
}

TEST(TestBoolHyperTrie, test_mult_write_read4) {
    // data
    std::vector<Key_t> keys{
            {0, 10, 8,  2},
            {2, 5,  10, 9},
            {1, 0,  10, 5},
            {3, 4,  3,  0},
            {4, 2,  2,  6},
            {2, 3,  3,  2},
            {1, 5,  3,  0},
            {6, 5,  6,  8},
            {1, 9,  7,  3}
    };
    bool value = true;

    uint8_t key_length = 4;

    // init
    BoolHyperTrie trie{key_length};

    // load data
    for (Key_t &key :keys) {
        trie.set(key, value);
    }

    // validate
    for (Key_t &key :keys) {
        std::variant<BoolHyperTrie *, bool> stored_value_ = trie.get(key);

        bool stored_value = std::get<bool>(stored_value_);
        ASSERT_EQ(stored_value, value);

    }
}

TEST(TestBoolHyperTrie, test_multi_level_read) {
    // data
    std::vector<Key_t> keys{
            {0, 10, 8,  2},
            {2, 5,  10, 9},
            {0, 4,  8,  9},
            {1, 0,  10, 5},
            {3, 4,  3,  0},
            {4, 2,  2,  6},
            {2, 3,  3,  2},
            {1, 5,  3,  0},
            {6, 5,  6,  8},
            {1, 9,  7,  3}
    };
    bool value = true;

    uint8_t key_length = 4;

    // init
    BoolHyperTrie trie{key_length};

    // load data
    for (Key_t &key :keys) {
        trie.set(key, value);
    }

    SliceKey_t subkey_0 = SliceKey_t{0, std::nullopt, std::nullopt, std::nullopt};
    const std::variant<BoolHyperTrie *, bool> &subtrie_0_ = trie.get(subkey_0);

    BoolHyperTrie *subtrie_0 = std::get<BoolHyperTrie *>(subtrie_0_);

    ASSERT_EQ(subtrie_0->depth(), 3);
    ASSERT_EQ(subtrie_0->size(), 2);


    SliceKey_t subkey_4 = SliceKey_t{4, std::nullopt, std::nullopt};
    const std::variant<BoolHyperTrie *, bool> &subtrie_04_ = subtrie_0->get(subkey_4);

    BoolHyperTrie *subtrie_04 = std::get<BoolHyperTrie *>(subtrie_04_);

    ASSERT_EQ(subtrie_04->depth(), 2);
    ASSERT_EQ(subtrie_04->size(), 1);


    SliceKey_t subkey_8 = SliceKey_t{8, std::nullopt};
    const std::variant<BoolHyperTrie *, bool> &subtrie_048_ = subtrie_04->get(subkey_8);

    BoolHyperTrie *subtrie_048 = std::get<BoolHyperTrie *>(subtrie_048_);

    ASSERT_EQ(subtrie_048->depth(), 1);
    ASSERT_EQ(subtrie_048->size(), 1);


    SliceKey_t subkey_9 = SliceKey_t{9};
    const std::variant<BoolHyperTrie *, bool> &subtrie_0489_ = subtrie_048->get(subkey_9);

    bool safed_value = std::get<bool>(subtrie_0489_);

    ASSERT_EQ(safed_value, value);
}

TEST(TestBoolHyperTrie, calc_card) {
    // data
    std::vector<Key_t> keys{
            {0, 1},
            {0, 2},
            {0, 3},
    };

    bool value = true;

    uint8_t key_length = 2;

    // init
    BoolHyperTrie trie{key_length};

    // load data
    for (auto &&key : keys) {
        trie.set(key, value);
    }

    ASSERT_EQ(trie.getCard(0), 1);

    ASSERT_EQ(trie.getCard(1), 3);
}

TEST(TestBoolHyperTrie, load_data1000) {
    // data
    Key_t key{0, 0, 0};


    // init
    BoolHyperTrie trie{3};

    const clock_t i1 = clock();
    // load data
    for (auto i : range(1000)) {
        key[0] = key_part_t(rand() % 300 + 1);
        key[1] = key_part_t(rand() % 400 + 1);
        key[2] = key_part_t(rand() % 500 + 1);
        trie.set(key, true);
        if (i % 10000 == 0) {
            fmt::print("triples: {}\n", i);
        }
    }

    fmt::print("triples loaded: {}\n", trie.size());
    fmt::print("distinct subjects: {}\n", trie.getCard(0));
    fmt::print("distinct predicates: {}\n", trie.getCard(1));
    fmt::print("distinct objects: {}\n", trie.getCard(2));

    double elapsed_secs = double(clock() - i1) / CLOCKS_PER_SEC;
    fmt::print("time: {} s\n", elapsed_secs);
}
