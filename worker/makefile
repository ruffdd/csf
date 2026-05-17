CXXFLAGS:= -I nlohmann-json -g --std=c++23
CXX=g++
CC=g++

.PHONY: json

worker:worker.o nodes.o

run-tests: testing
	./testing

testing: test.o
	$(CXX) $(LDFLAGS) $^ $(LOADLIBES) $(LDLIBS) $(shell pkg-config --libs catch2-with-main) -o $@
