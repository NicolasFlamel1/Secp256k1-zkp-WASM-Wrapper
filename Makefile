# Library parameters
NAME = "secp256k1-zkp"
CC = "em++"
CFLAGS = -Wall -D NDEBUG -Oz -finput-charset=UTF-8 -fexec-charset=UTF-8 -funsigned-char -ffunction-sections -fdata-sections -I "./secp256k1-zkp-master/include/" -s MODULARIZE=1 --memory-init-file=0 -s ABORTING_MALLOC=0 -s ALLOW_MEMORY_GROWTH=1 --closure 1 -flto -fno-rtti -fno-exceptions -s NO_FILESYSTEM=1 -s DISABLE_EXCEPTION_CATCHING=1 -s EXPORTED_FUNCTIONS="['_malloc', '_free']" -s EXPORT_NAME="secp256k1Zkp"
DEPENDENCY_CFLAGS = -D NDEBUG -Oz -finput-charset=UTF-8 -fexec-charset=UTF-8 -funsigned-char -ffunction-sections -fdata-sections -s MODULARIZE=1 --memory-init-file=0 -s ABORTING_MALLOC=0 -s ALLOW_MEMORY_GROWTH=1 --closure 1 -s ENVIRONMENT=web -flto -fno-rtti -fno-exceptions -s NO_FILESYSTEM=1 -s DISABLE_EXCEPTION_CATCHING=1
LIBS = -L "./secp256k1-zkp-master/.libs/" -lsecp256k1
SRCS = "./Secp256k1-zkp-NPM-Package-master/main.cpp"
PROGRAM_NAME = $(subst $\",,$(NAME))

# Make WASM
wasm:
	rm -rf "./dist"
	mkdir "./dist"
	$(CC) $(CFLAGS) -s WASM=1 -s ENVIRONMENT=web -o "./dist/$(PROGRAM_NAME).js" $(SRCS) $(LIBS)
	cat "./main.js" >> "./dist/$(PROGRAM_NAME).js"

# Make asm.js
asmjs:
	rm -rf "./dist"
	mkdir "./dist"
	$(CC) $(CFLAGS) -s WASM=0 -s ENVIRONMENT=web -o "./dist/$(PROGRAM_NAME).js" $(SRCS) $(LIBS)
	cat "./main.js" >> "./dist/$(PROGRAM_NAME).js"

# Make npm
npm:
	rm -rf "./dist"
	mkdir "./dist"
	$(CC) $(CFLAGS) -s WASM=1 -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 -o "./dist/wasm.js" $(SRCS) $(LIBS)
	$(CC) $(CFLAGS) -s WASM=0 -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 -o "./dist/asm.js" $(SRCS) $(LIBS)
	echo "\"use strict\"; const crypto = require(\"crypto\")[\"webcrypto\"]; const secp256k1Zkp = (typeof WebAssembly !== \"undefined\") ? require(\"./wasm.js\") : require(\"./asm.js\");" > "./dist/index.js"
	cat "./main.js" >> "./dist/index.js"

# Make clean
clean:
	rm -rf "./master.zip" "./secp256k1-zkp-master" "./Secp256k1-zkp-NPM-Package-master" "./dist"

# Make dependencies
dependencies:
	wget "https://github.com/NicolasFlamel1/secp256k1-zkp/archive/master.zip"
	unzip "./master.zip"
	cd "./secp256k1-zkp-master" && "./autogen.sh" && emconfigure "./configure" --enable-endomorphism --enable-module-ecdh --enable-experimental --enable-module-generator --enable-module-commitment --enable-module-bulletproof --enable-module-aggsig --with-bignum=no --with-asm=no --disable-benchmark --disable-tests --disable-exhaustive-tests --build=none --host=none CFLAGS="$(DEPENDENCY_CFLAGS)" CPPFLAGS="$(DEPENDENCY_CFLAGS)" CXXFLAGS="$(DEPENDENCY_CFLAGS)" --disable-shared CFLAGS_FOR_BUILD="$(DEPENDENCY_CFLAGS)" CPPFLAGS_FOR_BUILD="$(DEPENDENCY_CFLAGS)" CXXFLAGS_FOR_BUILD="$(DEPENDENCY_CFLAGS)" LDFLAGS_FOR_BUILD="$(DEPENDENCY_CFLAGS)" && emmake make
	rm "./master.zip"
	wget "https://github.com/NicolasFlamel1/Secp256k1-zkp-NPM-Package/archive/master.zip"
	unzip "./master.zip"
	rm "./master.zip"
