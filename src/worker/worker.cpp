#include <string>
#include <iostream>

std::string getNodeDefinition(){
    return std::string("no node definition");
}

template<typename T>
void log(T message){
    std::cout << message << std::endl;
}

int main(int argc, char const *argv[])
{
    log(getNodeDefinition());
    return 0;
}

