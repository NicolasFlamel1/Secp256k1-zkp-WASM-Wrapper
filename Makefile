# Library parameters
NAME = "secp256k1-zkp"
VERSION = "0.0.7"
CC = "em++"
CFLAGS = -Wall -D NDEBUG -Oz -finput-charset=UTF-8 -fexec-charset=UTF-8 -funsigned-char -ffunction-sections -fdata-sections -D VERSION=$(VERSION) -I "./secp256k1-zkp-master/include/" -s MODULARIZE=1 --memory-init-file=0 -s ABORTING_MALLOC=0 -s ALLOW_MEMORY_GROWTH=1 --closure 1 -flto -fno-rtti -fno-exceptions -s NO_FILESYSTEM=1 -s DISABLE_EXCEPTION_CATCHING=1 -s EXPORTED_FUNCTIONS="['_malloc', '_free']" -s EXPORT_NAME="secp256k1Zkp"
DEPENDENCY_CFLAGS = -D NDEBUG -Oz -finput-charset=UTF-8 -fexec-charset=UTF-8 -funsigned-char -ffunction-sections -fdata-sections -s MODULARIZE=1 --memory-init-file=0 -s ABORTING_MALLOC=0 -s ALLOW_MEMORY_GROWTH=1 --closure 1 -s ENVIRONMENT=web -flto -fno-rtti -fno-exceptions -s NO_FILESYSTEM=1 -s DISABLE_EXCEPTION_CATCHING=1
LIBS = -L "./secp256k1-zkp-master/.libs/" -lsecp256k1
SRCS = "./main.cpp"
PROGRAM_NAME = $(subst $\",,$(NAME))

# Make WASM
wasm:
	$(CC) $(CFLAGS) -s WASM=1 -s ENVIRONMENT=web -o "./$(PROGRAM_NAME).js" $(SRCS) $(LIBS)
	cat "./main.js" >> "./$(PROGRAM_NAME).js"
	rm -rf "./dist"
	mkdir "./dist"
	mv "./$(PROGRAM_NAME).js" "./$(PROGRAM_NAME).wasm" "./dist/"

# Make asm.js
asmjs:
	$(CC) $(CFLAGS) -s WASM=0 -s ENVIRONMENT=web -o "./$(PROGRAM_NAME).js" $(SRCS) $(LIBS)
	cat "./main.js" >> "./$(PROGRAM_NAME).js"
	rm -rf "./dist"
	mkdir "./dist"
	mv "./$(PROGRAM_NAME).js" "./dist/"

# Make npm
npm:
	$(CC) $(CFLAGS) -s WASM=1 -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 -o "./wasm.js" $(SRCS) $(LIBS)
	$(CC) $(CFLAGS) -s WASM=0 -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 -o "./asm.js" $(SRCS) $(LIBS)
	echo "try { global.crypto = require(\"crypto\"); module[\"exports\"] = require(\"@nicolasflamel/secp256k1-zkp-native\"); return;} catch(error) {} const secp256k1Zkp = (typeof WebAssembly !== \"undefined\") ? require(\"./wasm.js\") : require(\"./asm.js\");" > "./index.js"
	cat "./main.js" >> "./index.js"
	rm -rf "./dist"
	mkdir "./dist"
	mv "./index.js" "./wasm.js" "./asm.js" "./dist/"

# Make clean
clean:
	rm -rf "./$(PROGRAM_NAME).js" "./$(PROGRAM_NAME).wasm" "./index.js" "./wasm.js" "./asm.js" "./dist" "./secp256k1-zkp-master" "./master.zip"

# Make dependencies
dependencies:
	wget "https://github.com/NicolasFlamel1/secp256k1-zkp/archive/master.zip"
	unzip "./master.zip"
	cd "./secp256k1-zkp-master" && "./autogen.sh" && emconfigure "./configure" --enable-endomorphism --build=none --host=none CFLAGS="$(DEPENDENCY_CFLAGS)" CPPFLAGS="$(DEPENDENCY_CFLAGS)" CXXFLAGS="$(DEPENDENCY_CFLAGS)" --disable-shared CFLAGS_FOR_BUILD="$(DEPENDENCY_CFLAGS)" CPPFLAGS_FOR_BUILD="$(DEPENDENCY_CFLAGS)" CXXFLAGS_FOR_BUILD="$(DEPENDENCY_CFLAGS)" LDFLAGS_FOR_BUILD="$(DEPENDENCY_CFLAGS)" && emmake make
	rm "./master.zip"
