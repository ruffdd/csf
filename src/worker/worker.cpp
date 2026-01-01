#include <string>
#include <fstream>
#include <iostream>
#include "single_include/nlohmann/json.hpp"
#include <vector>
#include "nodes.hpp"
// #include "cli.cpp"

const std::string getNodeDefinition()
{
    return std::string("no node definition");
}

template <typename T>
void log(const T message)
{
    std::cout << message << std::endl;
}

std::vector<basic_node> create_nodes(const std::vector<nlohmann::json> nodes_json)
{
    std::vector<basic_node> output;
    for (auto node_json : nodes_json)
    {
        output.push_back(basic_node::instantiate_node(node_json));
    }
    return output;
}

void load_json(std::string path)
{
    std::ifstream nodes_file(path, std::ios::in);
    if (!nodes_file.is_open())
    {
        throw std::runtime_error("Could not open " +path + " (" +strerror(errno) + ")");
    }
    auto node_definition = nlohmann::json::parse(nodes_file);
    std::vector<nlohmann::json> nodes_json;
    try
    {
        node_definition.at("nodes").get_to(nodes_json);
    }
    catch (nlohmann::json::exception e)
    {
        throw std::runtime_error("Could not find nodes:\n" + std::string(e.what()));
    }
    auto nodes = create_nodes(nodes_json);
}

int main(int argc, char const *argv[])
{
    if (argc < 2)
    {
        log("need an node file to open");
        return 1;
    }
    load_json(argv[1]);
    return 0;
}
