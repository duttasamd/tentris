#include <gtest/gtest.h>
#include <tentris/store/RDF/TermStore.hpp>

namespace {
    using namespace tentris::store;
    using namespace tentris::util::types;
}
TEST(TestTermStore, double_write) {
    TermStore store{};
    const key_part_t &id_ = store[std::string{"\"xx\""}];
    const key_part_t &id2_ = store[std::string{"\"xx\""}];
    ASSERT_EQ(id_, id2_);
    ASSERT_EQ(store.size(), 1);
}

TEST(TestTermStore, inverse) {
    TermStore store{};
    const key_part_t &id_ = store[std::string{"\"xx\""}];
    store[std::string{"\"xx\""}];
    TermStore::RevTermStore &inv = store.inv();

    const std::shared_ptr<Term> &ptr = inv.at(id_);
    ASSERT_EQ(ptr->getIdentifier(), std::string{"\"xx\""});
    ASSERT_EQ(inv.size(), 1);
    ASSERT_EQ(&inv.inv(), &store);
}

