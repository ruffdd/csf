#include <string>
#include <map>
struct{
    const bool help = true;
};

bool is_char(const std::string str, const size_t index, const char character){
    if(index < 0 || index >= str.length()){
        return false;
    }else{
        return str[index]==character;
    }
}

class cli
{
private:
public:
    const std::string error_message;
    cli(const int argc,const char const *argv[]):(error_message="a") {
        std::map<std::string,const char const *> args;
        for(int i = 0; i < argc; i++){
            const std::string arg(argv[i]);
            if(arg.length() <= 1){
                continue;
            }else if(arg == "--help" ){
                arg[]
            }
        }
    }
    ~cli();
};
