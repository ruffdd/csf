#include "nodes.hpp"
#include <iostream>

basic_node::basic_node(nlohmann::json json_data)
{
    json_data["id"].get_to(id);
    json_data["type"].get_to(type);
    if (used_ids.contains(id))
    {
        throw std::runtime_error(std::format("A node with id {} already exists", id));
    }
}

std::set<uint32_t> basic_node::used_ids = std::set<uint32_t>();

basic_node basic_node::instantiate_node(nlohmann::json json_data)
{
    std::string type = json_data["type"];
    if (type == "SubscribeNode")
    {
        return SubscribeNode(json_data);
    }
    else
    {
        throw std::runtime_error("The type " + type + " is not a known node type");
    }
}