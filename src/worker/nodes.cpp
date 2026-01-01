#include <string>
#include <stdexcept>
class basic_node
{

public:
    static basic_node instantiate_node(std::string type);
};

class SubscribeNode : public basic_node
{
public:
    SubscribeNode(){

    }
};

basic_node basic_node::instantiate_node(std::string type)
{
    if (type == "SubscribeNode")
    {
        return SubscribeNode();
    }
    else
    {
        throw std::runtime_error("The type " + type + " is not a known node type");
    }
}