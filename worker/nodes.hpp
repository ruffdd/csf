#pragma once
#include <string>
#include <stdexcept>
#include <set>
#include <format>
#include "nlohmann-json/single_include/nlohmann/json.hpp"
class basic_node
{
    static std::set<u_int32_t> used_ids;

protected:
    u_int32_t id;
    std::string type;
    basic_node(nlohmann::json json_data);

public:
    static basic_node instantiate_node(nlohmann::json json_data);
};

class SubscribeNode : public basic_node
{

public:
    SubscribeNode(nlohmann::json json_data):basic_node(json_data)
    {
        
    }

public:
};
