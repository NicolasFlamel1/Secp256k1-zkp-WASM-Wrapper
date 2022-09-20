// Use strict
"use strict";


// Classes

// Secp256k1-zkp class
class Secp256k1Zkp {

	// Public
	
		// Initialize
		static initialize() {
		
			// Set instance to invalid
			Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			
			// Return promise
			return new Promise(function(resolve, reject) {
		
				// Set settings
				var settings = {
				
					// On abort
					"onAbort": function(error) {
					
						// Prevent on abort from being called again
						delete settings["onAbort"];
						
						// Reject error
						reject("Failed to download resource");
					}
				};
				
				// Create secp256k1-zkp instance
				secp256k1Zkp(settings).then(function(instance) {
				
					// Prevent on abort from being called
					delete settings["onAbort"];
				
					// Check if initializing failed
					if(instance._initialize() === Secp256k1Zkp.C_FALSE)
					
						// Reject error
						reject("Failed to initialize");
					
					// Otherwise
					else {
					
						// Set instance
						Secp256k1Zkp.instance = instance;
					
						// Resolve
						resolve();
					}
				});
			});
		}
		
		// Uninitialize
		static uninitialize() {
		
			// Check if instance exists and is invalid
			if(typeof Secp256k1Zkp.instance === "undefined" || Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
		
			// Uninitialize
			Secp256k1Zkp.instance._uninitialize();
		}
		
		// Blind switch
		static blindSwitch(blind, value) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize result to size of blind
			var result = new Uint8Array(Secp256k1Zkp.instance._blindSize());
			
			// Allocate and fill memory
			var resultBuffer = Secp256k1Zkp.instance._malloc(result["length"] * result["BYTES_PER_ELEMENT"]);
			
			var blindBuffer = Secp256k1Zkp.instance._malloc(blind["length"] * blind["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(blind, blindBuffer / blind["BYTES_PER_ELEMENT"]);
			
			var cStringValue = Secp256k1Zkp.stringToCString(value);
			var valueBuffer = Secp256k1Zkp.instance._malloc(cStringValue["length"] * cStringValue["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(cStringValue, valueBuffer / cStringValue["BYTES_PER_ELEMENT"]);
			cStringValue.fill(0);
			
			// Check if performing blind switch failed
			if(Secp256k1Zkp.instance._blindSwitch(resultBuffer, blindBuffer, blind["length"] * blind["BYTES_PER_ELEMENT"], valueBuffer) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, blindBuffer / blind["BYTES_PER_ELEMENT"], blindBuffer / blind["BYTES_PER_ELEMENT"] + blind["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, valueBuffer / cStringValue["BYTES_PER_ELEMENT"], valueBuffer / cStringValue["BYTES_PER_ELEMENT"] + cStringValue["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(resultBuffer);
				Secp256k1Zkp.instance._free(blindBuffer);
				Secp256k1Zkp.instance._free(valueBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, blindBuffer / blind["BYTES_PER_ELEMENT"], blindBuffer / blind["BYTES_PER_ELEMENT"] + blind["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, valueBuffer / cStringValue["BYTES_PER_ELEMENT"], valueBuffer / cStringValue["BYTES_PER_ELEMENT"] + cStringValue["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(resultBuffer);
			Secp256k1Zkp.instance._free(blindBuffer);
			Secp256k1Zkp.instance._free(valueBuffer);
			
			// Return result
			return result;
		}
		
		// Blind sum
		static blindSum(positiveBlinds, negativeBlinds) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize result to size of blind
			var result = new Uint8Array(Secp256k1Zkp.instance._blindSize());
			
			// Allocate and fill memory
			var resultBuffer = Secp256k1Zkp.instance._malloc(result["length"] * result["BYTES_PER_ELEMENT"]);
			
			var blindsLength = positiveBlinds.reduce(function(positiveBlindsLength, positiveBlind) {
			
				// Return length of positive blind added to total
				return positiveBlindsLength + positiveBlind["length"];
				
			}, 0) + negativeBlinds.reduce(function(negativeBlindsLength, negativeBlind) {
			
				// Return length of negative blind added to total
				return negativeBlindsLength + negativeBlind["length"];
				
			}, 0);
			
			var blindsBuffer = Secp256k1Zkp.instance._malloc(blindsLength * Uint8Array["BYTES_PER_ELEMENT"]);
			
			// Go through all positive and negative blinds
			var blindsOffset = 0;
			for(var i = 0; i < positiveBlinds["length"] + negativeBlinds["length"]; ++i) {
			
				// Get blind
				var blind = (i < positiveBlinds["length"]) ? positiveBlinds[i] : negativeBlinds[i - positiveBlinds["length"]];
				
				// Set blind in memory at offset
				Secp256k1Zkp.instance["HEAPU8"].set(blind, blindsBuffer / Uint8Array["BYTES_PER_ELEMENT"] + blindsOffset);
				
				// Update offset
				blindsOffset += blind["length"];
			}
			
			var blindsSizesBuffer = Secp256k1Zkp.instance._malloc((positiveBlinds["length"] + negativeBlinds["length"]) * Uint32Array["BYTES_PER_ELEMENT"]);
			
			for(var i = 0; i < positiveBlinds["length"] + negativeBlinds["length"]; ++i)
				Secp256k1Zkp.instance["HEAPU32"].set(new Uint32Array([(i < positiveBlinds["length"]) ? positiveBlinds[i]["length"] : negativeBlinds[i - positiveBlinds["length"]]["length"]]), blindsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + i);
			
			// Check if performing blind sum failed
			if(Secp256k1Zkp.instance._blindSum(resultBuffer, blindsBuffer, blindsSizesBuffer, positiveBlinds["length"] + negativeBlinds["length"], positiveBlinds["length"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, blindsBuffer / Uint8Array["BYTES_PER_ELEMENT"], blindsBuffer / Uint8Array["BYTES_PER_ELEMENT"] + blindsLength);
				Secp256k1Zkp.instance["HEAPU32"].fill(0, blindsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"], blindsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + positiveBlinds["length"] + negativeBlinds["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(resultBuffer);
				Secp256k1Zkp.instance._free(blindsBuffer);
				Secp256k1Zkp.instance._free(blindsSizesBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, blindsBuffer / Uint8Array["BYTES_PER_ELEMENT"], blindsBuffer / Uint8Array["BYTES_PER_ELEMENT"] + blindsLength);
			Secp256k1Zkp.instance["HEAPU32"].fill(0, blindsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"], blindsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + positiveBlinds["length"] + negativeBlinds["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(resultBuffer);
			Secp256k1Zkp.instance._free(blindsBuffer);
			Secp256k1Zkp.instance._free(blindsSizesBuffer);
			
			// Return result
			return result;
		}
		
		// Is valid secret key
		static isValidSecretKey(secretKey) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Allocate and fill memory
			var secretKeyBuffer = Secp256k1Zkp.instance._malloc(secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(secretKey, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"]);
			
			// Check if secret key is not a valid secret key
			if(Secp256k1Zkp.instance._isValidSecretKey(secretKeyBuffer, secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(secretKeyBuffer);
			
				// Return false
				return false;
			}
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(secretKeyBuffer);
			
			// Return true
			return true;
		}
		
		// Is valid public key
		static isValidPublicKey(publicKey) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Allocate and fill memory
			var publicKeyBuffer = Secp256k1Zkp.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(publicKey, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"]);
			
			// Check if public key is not a valid public key
			if(Secp256k1Zkp.instance._isValidPublicKey(publicKeyBuffer, publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(publicKeyBuffer);
			
				// Return false
				return false;
			}
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(publicKeyBuffer);
			
			// Return true
			return true;
		}
		
		// Is valid commit
		static isValidCommit(commit) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Allocate and fill memory
			var commitBuffer = Secp256k1Zkp.instance._malloc(commit["length"] * commit["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(commit, commitBuffer / commit["BYTES_PER_ELEMENT"]);
			
			// Check if commit is not a valid commit
			if(Secp256k1Zkp.instance._isValidCommit(commitBuffer, commit["length"] * commit["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, commitBuffer / commit["BYTES_PER_ELEMENT"], commitBuffer / commit["BYTES_PER_ELEMENT"] + commit["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(commitBuffer);
			
				// Return false
				return false;
			}
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, commitBuffer / commit["BYTES_PER_ELEMENT"], commitBuffer / commit["BYTES_PER_ELEMENT"] + commit["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(commitBuffer);
			
			// Return true
			return true;
		}
		
		// Is valid single-signer signature
		static isValidSingleSignerSignature(signature) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Allocate and fill memory
			var signatureBuffer = Secp256k1Zkp.instance._malloc(signature["length"] * signature["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(signature, signatureBuffer / signature["BYTES_PER_ELEMENT"]);
			
			// Check if signature is not a valid single-signer signature
			if(Secp256k1Zkp.instance._isValidSingleSignerSignature(signatureBuffer, signature["length"] * signature["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(signatureBuffer);
			
				// Return false
				return false;
			}
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(signatureBuffer);
			
			// Return true
			return true;
		}
		
		// Create bulletproof
		static createBulletproof(blind, value, nonce, privateNonce, extraCommit, message) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize proof to size of bulletproof proof
			var proof = new Uint8Array(Secp256k1Zkp.instance._bulletproofProofSize());
			
			// Initialize proof size to size of a max 64-bit integer C string
			var proofSize = new Uint8Array(Secp256k1Zkp.MAX_64_BIT_INTEGER_C_STRING["length"]);
			
			// Allocate and fill memory
			var proofBuffer = Secp256k1Zkp.instance._malloc(proof["length"] * proof["BYTES_PER_ELEMENT"]);
			
			var proofSizeBuffer = Secp256k1Zkp.instance._malloc(proofSize["length"] * proofSize["BYTES_PER_ELEMENT"]);
			
			var blindBuffer = Secp256k1Zkp.instance._malloc(blind["length"] * blind["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(blind, blindBuffer / blind["BYTES_PER_ELEMENT"]);
			
			var cStringValue = Secp256k1Zkp.stringToCString(value);
			var valueBuffer = Secp256k1Zkp.instance._malloc(cStringValue["length"] * cStringValue["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(cStringValue, valueBuffer / cStringValue["BYTES_PER_ELEMENT"]);
			cStringValue.fill(0);
			
			var nonceBuffer = Secp256k1Zkp.instance._malloc(nonce["length"] * nonce["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(nonce, nonceBuffer / nonce["BYTES_PER_ELEMENT"]);
			
			var privateNonceBuffer = Secp256k1Zkp.instance._malloc(privateNonce["length"] * privateNonce["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(privateNonce, privateNonceBuffer / privateNonce["BYTES_PER_ELEMENT"]);
			
			var extraCommitBuffer = Secp256k1Zkp.instance._malloc(extraCommit["length"] * extraCommit["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(extraCommit, extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"]);
			
			var messageBuffer = Secp256k1Zkp.instance._malloc(message["length"] * message["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(message, messageBuffer / message["BYTES_PER_ELEMENT"]);
			
			// Check if creating bulletproof failed
			if(Secp256k1Zkp.instance._createBulletproof(proofBuffer, proofSizeBuffer, blindBuffer, blind["length"] * blind["BYTES_PER_ELEMENT"], valueBuffer, nonceBuffer, nonce["length"] * nonce["BYTES_PER_ELEMENT"], privateNonceBuffer, privateNonce["length"] * privateNonce["BYTES_PER_ELEMENT"], extraCommitBuffer, extraCommit["length"] * extraCommit["BYTES_PER_ELEMENT"], messageBuffer, message["length"] * message["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, proofBuffer / proof["BYTES_PER_ELEMENT"], proofBuffer / proof["BYTES_PER_ELEMENT"] + proof["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, proofSizeBuffer / proofSize["BYTES_PER_ELEMENT"], proofSizeBuffer / proofSize["BYTES_PER_ELEMENT"] + proofSize["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, blindBuffer / blind["BYTES_PER_ELEMENT"], blindBuffer / blind["BYTES_PER_ELEMENT"] + blind["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, valueBuffer / cStringValue["BYTES_PER_ELEMENT"], valueBuffer / cStringValue["BYTES_PER_ELEMENT"] + cStringValue["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, nonceBuffer / nonce["BYTES_PER_ELEMENT"], nonceBuffer / nonce["BYTES_PER_ELEMENT"] + nonce["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, privateNonceBuffer / privateNonce["BYTES_PER_ELEMENT"], privateNonceBuffer / privateNonce["BYTES_PER_ELEMENT"] + privateNonce["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"], extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"] + extraCommit["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, messageBuffer / message["BYTES_PER_ELEMENT"], messageBuffer / message["BYTES_PER_ELEMENT"] + message["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(proofBuffer);
				Secp256k1Zkp.instance._free(proofSizeBuffer);
				Secp256k1Zkp.instance._free(blindBuffer);
				Secp256k1Zkp.instance._free(valueBuffer);
				Secp256k1Zkp.instance._free(nonceBuffer);
				Secp256k1Zkp.instance._free(privateNonceBuffer);
				Secp256k1Zkp.instance._free(extraCommitBuffer);
				Secp256k1Zkp.instance._free(messageBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get proof size
			proofSize = Secp256k1Zkp.cStringToString(Secp256k1Zkp.instance["HEAPU8"].subarray(proofSizeBuffer, proofSizeBuffer + proofSize["length"]));
			
			// Get proof
			proof = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(proofBuffer, proofBuffer + parseInt(proofSize, Secp256k1Zkp.DECIMAL_NUMBER_BASE)));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, proofBuffer / proof["BYTES_PER_ELEMENT"], proofBuffer / proof["BYTES_PER_ELEMENT"] + proof["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, proofSizeBuffer / proofSize["BYTES_PER_ELEMENT"], proofSizeBuffer / proofSize["BYTES_PER_ELEMENT"] + proofSize["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, blindBuffer / blind["BYTES_PER_ELEMENT"], blindBuffer / blind["BYTES_PER_ELEMENT"] + blind["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, valueBuffer / cStringValue["BYTES_PER_ELEMENT"], valueBuffer / cStringValue["BYTES_PER_ELEMENT"] + cStringValue["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, nonceBuffer / nonce["BYTES_PER_ELEMENT"], nonceBuffer / nonce["BYTES_PER_ELEMENT"] + nonce["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, privateNonceBuffer / privateNonce["BYTES_PER_ELEMENT"], privateNonceBuffer / privateNonce["BYTES_PER_ELEMENT"] + privateNonce["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"], extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"] + extraCommit["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, messageBuffer / message["BYTES_PER_ELEMENT"], messageBuffer / message["BYTES_PER_ELEMENT"] + message["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(proofBuffer);
			Secp256k1Zkp.instance._free(proofSizeBuffer);
			Secp256k1Zkp.instance._free(blindBuffer);
			Secp256k1Zkp.instance._free(valueBuffer);
			Secp256k1Zkp.instance._free(nonceBuffer);
			Secp256k1Zkp.instance._free(privateNonceBuffer);
			Secp256k1Zkp.instance._free(extraCommitBuffer);
			Secp256k1Zkp.instance._free(messageBuffer);
			
			// Return proof
			return proof;
		}
		
		// Create bulletproof blindless
		static createBulletproofBlindless(tauX, tOne, tTwo, commit, value, nonce, extraCommit, message) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize proof to size of bulletproof proof
			var proof = new Uint8Array(Secp256k1Zkp.instance._bulletproofProofSize());
			
			// Initialize proof size to size of a max 64-bit integer C string
			var proofSize = new Uint8Array(Secp256k1Zkp.MAX_64_BIT_INTEGER_C_STRING["length"]);
			
			// Allocate and fill memory
			var proofBuffer = Secp256k1Zkp.instance._malloc(proof["length"] * proof["BYTES_PER_ELEMENT"]);
			
			var proofSizeBuffer = Secp256k1Zkp.instance._malloc(proofSize["length"] * proofSize["BYTES_PER_ELEMENT"]);
			
			var tauXBuffer = Secp256k1Zkp.instance._malloc(tauX["length"] * tauX["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(tauX, tauXBuffer / tauX["BYTES_PER_ELEMENT"]);
			
			var tOneBuffer = Secp256k1Zkp.instance._malloc(tOne["length"] * tOne["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(tOne, tOneBuffer / tOne["BYTES_PER_ELEMENT"]);
			
			var tTwoBuffer = Secp256k1Zkp.instance._malloc(tTwo["length"] * tTwo["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(tTwo, tTwoBuffer / tTwo["BYTES_PER_ELEMENT"]);
			
			var commitBuffer = Secp256k1Zkp.instance._malloc(commit["length"] * commit["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(commit, commitBuffer / commit["BYTES_PER_ELEMENT"]);
			
			var cStringValue = Secp256k1Zkp.stringToCString(value);
			var valueBuffer = Secp256k1Zkp.instance._malloc(cStringValue["length"] * cStringValue["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(cStringValue, valueBuffer / cStringValue["BYTES_PER_ELEMENT"]);
			cStringValue.fill(0);
			
			var nonceBuffer = Secp256k1Zkp.instance._malloc(nonce["length"] * nonce["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(nonce, nonceBuffer / nonce["BYTES_PER_ELEMENT"]);
			
			var extraCommitBuffer = Secp256k1Zkp.instance._malloc(extraCommit["length"] * extraCommit["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(extraCommit, extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"]);
			
			var messageBuffer = Secp256k1Zkp.instance._malloc(message["length"] * message["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(message, messageBuffer / message["BYTES_PER_ELEMENT"]);
			
			// Check if creating bulletproof blindless failed
			if(Secp256k1Zkp.instance._createBulletproofBlindless(proofBuffer, proofSizeBuffer, tauXBuffer, tauX["length"] * tauX["BYTES_PER_ELEMENT"], tOneBuffer, tOne["length"] * tOne["BYTES_PER_ELEMENT"], tTwoBuffer, tTwo["length"] * tTwo["BYTES_PER_ELEMENT"], commitBuffer, commit["length"] * commit["BYTES_PER_ELEMENT"], valueBuffer, nonceBuffer, nonce["length"] * nonce["BYTES_PER_ELEMENT"], extraCommitBuffer, extraCommit["length"] * extraCommit["BYTES_PER_ELEMENT"], messageBuffer, message["length"] * message["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, proofBuffer / proof["BYTES_PER_ELEMENT"], proofBuffer / proof["BYTES_PER_ELEMENT"] + proof["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, proofSizeBuffer / proofSize["BYTES_PER_ELEMENT"], proofSizeBuffer / proofSize["BYTES_PER_ELEMENT"] + proofSize["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, tauXBuffer / tauX["BYTES_PER_ELEMENT"], tauXBuffer / tauX["BYTES_PER_ELEMENT"] + tauX["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, tOneBuffer / tOne["BYTES_PER_ELEMENT"], tOneBuffer / tOne["BYTES_PER_ELEMENT"] + tOne["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, tTwoBuffer / tTwo["BYTES_PER_ELEMENT"], tTwoBuffer / tTwo["BYTES_PER_ELEMENT"] + tTwo["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, commitBuffer / commit["BYTES_PER_ELEMENT"], commitBuffer / commit["BYTES_PER_ELEMENT"] + commit["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, valueBuffer / cStringValue["BYTES_PER_ELEMENT"], valueBuffer / cStringValue["BYTES_PER_ELEMENT"] + cStringValue["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, nonceBuffer / nonce["BYTES_PER_ELEMENT"], nonceBuffer / nonce["BYTES_PER_ELEMENT"] + nonce["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"], extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"] + extraCommit["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, messageBuffer / message["BYTES_PER_ELEMENT"], messageBuffer / message["BYTES_PER_ELEMENT"] + message["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(proofBuffer);
				Secp256k1Zkp.instance._free(proofSizeBuffer);
				Secp256k1Zkp.instance._free(tauXBuffer);
				Secp256k1Zkp.instance._free(tOneBuffer);
				Secp256k1Zkp.instance._free(tTwoBuffer);
				Secp256k1Zkp.instance._free(commitBuffer);
				Secp256k1Zkp.instance._free(valueBuffer);
				Secp256k1Zkp.instance._free(nonceBuffer);
				Secp256k1Zkp.instance._free(extraCommitBuffer);
				Secp256k1Zkp.instance._free(messageBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get proof size
			proofSize = Secp256k1Zkp.cStringToString(Secp256k1Zkp.instance["HEAPU8"].subarray(proofSizeBuffer, proofSizeBuffer + proofSize["length"]));
			
			// Get proof
			proof = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(proofBuffer, proofBuffer + parseInt(proofSize, Secp256k1Zkp.DECIMAL_NUMBER_BASE)));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, proofBuffer / proof["BYTES_PER_ELEMENT"], proofBuffer / proof["BYTES_PER_ELEMENT"] + proof["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, proofSizeBuffer / proofSize["BYTES_PER_ELEMENT"], proofSizeBuffer / proofSize["BYTES_PER_ELEMENT"] + proofSize["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, tauXBuffer / tauX["BYTES_PER_ELEMENT"], tauXBuffer / tauX["BYTES_PER_ELEMENT"] + tauX["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, tOneBuffer / tOne["BYTES_PER_ELEMENT"], tOneBuffer / tOne["BYTES_PER_ELEMENT"] + tOne["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, tTwoBuffer / tTwo["BYTES_PER_ELEMENT"], tTwoBuffer / tTwo["BYTES_PER_ELEMENT"] + tTwo["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, commitBuffer / commit["BYTES_PER_ELEMENT"], commitBuffer / commit["BYTES_PER_ELEMENT"] + commit["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, valueBuffer / cStringValue["BYTES_PER_ELEMENT"], valueBuffer / cStringValue["BYTES_PER_ELEMENT"] + cStringValue["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, nonceBuffer / nonce["BYTES_PER_ELEMENT"], nonceBuffer / nonce["BYTES_PER_ELEMENT"] + nonce["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"], extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"] + extraCommit["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, messageBuffer / message["BYTES_PER_ELEMENT"], messageBuffer / message["BYTES_PER_ELEMENT"] + message["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(proofBuffer);
			Secp256k1Zkp.instance._free(proofSizeBuffer);
			Secp256k1Zkp.instance._free(tauXBuffer);
			Secp256k1Zkp.instance._free(tOneBuffer);
			Secp256k1Zkp.instance._free(tTwoBuffer);
			Secp256k1Zkp.instance._free(commitBuffer);
			Secp256k1Zkp.instance._free(valueBuffer);
			Secp256k1Zkp.instance._free(nonceBuffer);
			Secp256k1Zkp.instance._free(extraCommitBuffer);
			Secp256k1Zkp.instance._free(messageBuffer);
			
			// Return proof
			return proof;
		}
		
		// Rewind bulletproof
		static rewindBulletproof(proof, commit, nonce) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize value to size of a max 64-bit integer C string
			var value = new Uint8Array(Secp256k1Zkp.MAX_64_BIT_INTEGER_C_STRING["length"]);
			
			// Initialize blind to size of blind
			var blind = new Uint8Array(Secp256k1Zkp.instance._blindSize());
			
			// Initialize message to size of rewind bulletproof message
			var message = new Uint8Array(Secp256k1Zkp.instance._bulletproofMessageSize());
			
			// Allocate and fill memory
			var valueBuffer = Secp256k1Zkp.instance._malloc(value["length"] * value["BYTES_PER_ELEMENT"]);
			
			var blindBuffer = Secp256k1Zkp.instance._malloc(blind["length"] * blind["BYTES_PER_ELEMENT"]);
			
			var messageBuffer = Secp256k1Zkp.instance._malloc(message["length"] * message["BYTES_PER_ELEMENT"]);
			
			var proofBuffer = Secp256k1Zkp.instance._malloc(proof["length"] * proof["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(proof, proofBuffer / proof["BYTES_PER_ELEMENT"]);
			
			var commitBuffer = Secp256k1Zkp.instance._malloc(commit["length"] * commit["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(commit, commitBuffer / commit["BYTES_PER_ELEMENT"]);
			
			var nonceBuffer = Secp256k1Zkp.instance._malloc(nonce["length"] * nonce["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(nonce, nonceBuffer / nonce["BYTES_PER_ELEMENT"]);
			
			// Check if performing rewind bulletproof failed
			if(Secp256k1Zkp.instance._rewindBulletproof(valueBuffer, blindBuffer, messageBuffer, proofBuffer, proof["length"] * proof["BYTES_PER_ELEMENT"], commitBuffer, commit["length"] * commit["BYTES_PER_ELEMENT"], nonceBuffer, nonce["length"] * nonce["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, valueBuffer / value["BYTES_PER_ELEMENT"], valueBuffer / value["BYTES_PER_ELEMENT"] + value["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, blindBuffer / blind["BYTES_PER_ELEMENT"], blindBuffer / blind["BYTES_PER_ELEMENT"] + blind["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, messageBuffer / message["BYTES_PER_ELEMENT"], messageBuffer / message["BYTES_PER_ELEMENT"] + message["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, proofBuffer / proof["BYTES_PER_ELEMENT"], proofBuffer / proof["BYTES_PER_ELEMENT"] + proof["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, commitBuffer / commit["BYTES_PER_ELEMENT"], commitBuffer / commit["BYTES_PER_ELEMENT"] + commit["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, nonceBuffer / nonce["BYTES_PER_ELEMENT"], nonceBuffer / nonce["BYTES_PER_ELEMENT"] + nonce["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(valueBuffer);
				Secp256k1Zkp.instance._free(blindBuffer);
				Secp256k1Zkp.instance._free(messageBuffer);
				Secp256k1Zkp.instance._free(proofBuffer);
				Secp256k1Zkp.instance._free(commitBuffer);
				Secp256k1Zkp.instance._free(nonceBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get value
			value = Secp256k1Zkp.cStringToString(Secp256k1Zkp.instance["HEAPU8"].subarray(valueBuffer, valueBuffer + value["length"]));
			
			// Get blind
			blind = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(blindBuffer, blindBuffer + blind["length"]));
			
			// Get message
			message = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(messageBuffer, messageBuffer + message["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, valueBuffer / value["BYTES_PER_ELEMENT"], valueBuffer / value["BYTES_PER_ELEMENT"] + value["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, blindBuffer / blind["BYTES_PER_ELEMENT"], blindBuffer / blind["BYTES_PER_ELEMENT"] + blind["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, messageBuffer / message["BYTES_PER_ELEMENT"], messageBuffer / message["BYTES_PER_ELEMENT"] + message["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, proofBuffer / proof["BYTES_PER_ELEMENT"], proofBuffer / proof["BYTES_PER_ELEMENT"] + proof["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, commitBuffer / commit["BYTES_PER_ELEMENT"], commitBuffer / commit["BYTES_PER_ELEMENT"] + commit["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, nonceBuffer / nonce["BYTES_PER_ELEMENT"], nonceBuffer / nonce["BYTES_PER_ELEMENT"] + nonce["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(valueBuffer);
			Secp256k1Zkp.instance._free(blindBuffer);
			Secp256k1Zkp.instance._free(messageBuffer);
			Secp256k1Zkp.instance._free(proofBuffer);
			Secp256k1Zkp.instance._free(commitBuffer);
			Secp256k1Zkp.instance._free(nonceBuffer);
			
			// Return value, blind, and message
			return {
			
				// Value
				"Value": value,
				
				// Blind
				"Blind": blind,
				
				// Message
				"Message": message
			};
		}
		
		// Verify bulletproof
		static verifyBulletproof(proof, commit, extraCommit) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Allocate and fill memory
			var proofBuffer = Secp256k1Zkp.instance._malloc(proof["length"] * proof["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(proof, proofBuffer / proof["BYTES_PER_ELEMENT"]);
			
			var commitBuffer = Secp256k1Zkp.instance._malloc(commit["length"] * commit["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(commit, commitBuffer / commit["BYTES_PER_ELEMENT"]);
			
			var extraCommitBuffer = Secp256k1Zkp.instance._malloc(extraCommit["length"] * extraCommit["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(extraCommit, extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"]);
			
			// Check if bulletproof isn't verified
			if(Secp256k1Zkp.instance._verifyBulletproof(proofBuffer, proof["length"] * proof["BYTES_PER_ELEMENT"], commitBuffer, commit["length"] * commit["BYTES_PER_ELEMENT"], extraCommitBuffer, extraCommit["length"] * extraCommit["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, proofBuffer / proof["BYTES_PER_ELEMENT"], proofBuffer / proof["BYTES_PER_ELEMENT"] + proof["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, commitBuffer / commit["BYTES_PER_ELEMENT"], commitBuffer / commit["BYTES_PER_ELEMENT"] + commit["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"], extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"] + extraCommit["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(proofBuffer);
				Secp256k1Zkp.instance._free(commitBuffer);
				Secp256k1Zkp.instance._free(extraCommitBuffer);
			
				// Return false
				return false;
			}
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, proofBuffer / proof["BYTES_PER_ELEMENT"], proofBuffer / proof["BYTES_PER_ELEMENT"] + proof["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, commitBuffer / commit["BYTES_PER_ELEMENT"], commitBuffer / commit["BYTES_PER_ELEMENT"] + commit["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"], extraCommitBuffer / extraCommit["BYTES_PER_ELEMENT"] + extraCommit["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(proofBuffer);
			Secp256k1Zkp.instance._free(commitBuffer);
			Secp256k1Zkp.instance._free(extraCommitBuffer);
			
			// Return true
			return true;
		}
		
		// Public key from secret key
		static publicKeyFromSecretKey(secretKey) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize public key to size of public key
			var publicKey = new Uint8Array(Secp256k1Zkp.instance._publicKeySize());
			
			// Allocate and fill memory
			var publicKeyBuffer = Secp256k1Zkp.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			
			var secretKeyBuffer = Secp256k1Zkp.instance._malloc(secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(secretKey, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"]);
			
			// Check if getting public key from secret key failed
			if(Secp256k1Zkp.instance._publicKeyFromSecretKey(publicKeyBuffer, secretKeyBuffer, secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(publicKeyBuffer);
				Secp256k1Zkp.instance._free(secretKeyBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get public key
			publicKey = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(publicKeyBuffer, publicKeyBuffer + publicKey["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(publicKeyBuffer);
			Secp256k1Zkp.instance._free(secretKeyBuffer);
			
			// Return public key
			return publicKey;
		}
		
		// Public key from data
		static publicKeyFromData(data) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize public key to size of public key
			var publicKey = new Uint8Array(Secp256k1Zkp.instance._publicKeySize());
			
			// Allocate and fill memory
			var publicKeyBuffer = Secp256k1Zkp.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			
			var dataBuffer = Secp256k1Zkp.instance._malloc(data["length"] * data["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(data, dataBuffer / data["BYTES_PER_ELEMENT"]);
			
			// Check if getting public key from data failed
			if(Secp256k1Zkp.instance._publicKeyFromData(publicKeyBuffer, dataBuffer, data["length"] * data["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, dataBuffer / data["BYTES_PER_ELEMENT"], dataBuffer / data["BYTES_PER_ELEMENT"] + data["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(publicKeyBuffer);
				Secp256k1Zkp.instance._free(dataBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get public key
			publicKey = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(publicKeyBuffer, publicKeyBuffer + publicKey["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, dataBuffer / data["BYTES_PER_ELEMENT"], dataBuffer / data["BYTES_PER_ELEMENT"] + data["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(publicKeyBuffer);
			Secp256k1Zkp.instance._free(dataBuffer);
			
			// Return public key
			return publicKey;
		}
		
		// Uncompress public key
		static uncompressPublicKey(publicKey) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize uncompressed public key to size of uncompressed public key
			var uncompressedPublicKey = new Uint8Array(Secp256k1Zkp.instance._uncompressedPublicKeySize());
			
			// Allocate and fill memory
			var uncompressedPublicKeyBuffer = Secp256k1Zkp.instance._malloc(uncompressedPublicKey["length"] * uncompressedPublicKey["BYTES_PER_ELEMENT"]);
			
			var publicKeyBuffer = Secp256k1Zkp.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(publicKey, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"]);
			
			// Check if uncompressing the public key failed
			if(Secp256k1Zkp.instance._uncompressPublicKey(uncompressedPublicKeyBuffer, publicKeyBuffer, publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, uncompressedPublicKeyBuffer / uncompressedPublicKey["BYTES_PER_ELEMENT"], uncompressedPublicKeyBuffer / uncompressedPublicKey["BYTES_PER_ELEMENT"] + uncompressedPublicKey["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(uncompressedPublicKeyBuffer);
				Secp256k1Zkp.instance._free(publicKeyBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get uncompressed public key
			uncompressedPublicKey = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(uncompressedPublicKeyBuffer, uncompressedPublicKeyBuffer + uncompressedPublicKey["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, uncompressedPublicKeyBuffer / uncompressedPublicKey["BYTES_PER_ELEMENT"], uncompressedPublicKeyBuffer / uncompressedPublicKey["BYTES_PER_ELEMENT"] + uncompressedPublicKey["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(uncompressedPublicKeyBuffer);
			Secp256k1Zkp.instance._free(publicKeyBuffer);
			
			// Return uncompressed public key
			return uncompressedPublicKey;
		}
		
		// Secret key tweak add
		static secretKeyTweakAdd(secretKey, tweak) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize result to size of secret key
			var result = new Uint8Array(Secp256k1Zkp.instance._secretKeySize());
			
			// Allocate and fill memory
			var resultBuffer = Secp256k1Zkp.instance._malloc(result["length"] * result["BYTES_PER_ELEMENT"]);
			
			var secretKeyBuffer = Secp256k1Zkp.instance._malloc(secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(secretKey, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"]);
			
			var tweakBuffer = Secp256k1Zkp.instance._malloc(tweak["length"] * tweak["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(tweak, tweakBuffer / tweak["BYTES_PER_ELEMENT"]);
			
			// Check if performing secret key tweak add failed
			if(Secp256k1Zkp.instance._secretKeyTweakAdd(resultBuffer, secretKeyBuffer, secretKey["length"] * secretKey["BYTES_PER_ELEMENT"], tweakBuffer, tweak["length"] * tweak["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, tweakBuffer / tweak["BYTES_PER_ELEMENT"], tweakBuffer / tweak["BYTES_PER_ELEMENT"] + tweak["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(resultBuffer);
				Secp256k1Zkp.instance._free(secretKeyBuffer);
				Secp256k1Zkp.instance._free(tweakBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, tweakBuffer / tweak["BYTES_PER_ELEMENT"], tweakBuffer / tweak["BYTES_PER_ELEMENT"] + tweak["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(resultBuffer);
			Secp256k1Zkp.instance._free(secretKeyBuffer);
			Secp256k1Zkp.instance._free(tweakBuffer);
			
			// Return result
			return result;
		}
		
		// Public key tweak add
		static publicKeyTweakAdd(publicKey, tweak) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize result to size of public key
			var result = new Uint8Array(Secp256k1Zkp.instance._publicKeySize());
			
			// Allocate and fill memory
			var resultBuffer = Secp256k1Zkp.instance._malloc(result["length"] * result["BYTES_PER_ELEMENT"]);
			
			var publicKeyBuffer = Secp256k1Zkp.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(publicKey, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"]);
			
			var tweakBuffer = Secp256k1Zkp.instance._malloc(tweak["length"] * tweak["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(tweak, tweakBuffer / tweak["BYTES_PER_ELEMENT"]);
			
			// Check if performing public key tweak add failed
			if(Secp256k1Zkp.instance._publicKeyTweakAdd(resultBuffer, publicKeyBuffer, publicKey["length"] * publicKey["BYTES_PER_ELEMENT"], tweakBuffer, tweak["length"] * tweak["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, tweakBuffer / tweak["BYTES_PER_ELEMENT"], tweakBuffer / tweak["BYTES_PER_ELEMENT"] + tweak["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(resultBuffer);
				Secp256k1Zkp.instance._free(publicKeyBuffer);
				Secp256k1Zkp.instance._free(tweakBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, tweakBuffer / tweak["BYTES_PER_ELEMENT"], tweakBuffer / tweak["BYTES_PER_ELEMENT"] + tweak["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(resultBuffer);
			Secp256k1Zkp.instance._free(publicKeyBuffer);
			Secp256k1Zkp.instance._free(tweakBuffer);
			
			// Return result
			return result;
		}
		
		// Secret key tweak multiply
		static secretKeyTweakMultiply(secretKey, tweak) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize result to size of secret key
			var result = new Uint8Array(Secp256k1Zkp.instance._secretKeySize());
			
			// Allocate and fill memory
			var resultBuffer = Secp256k1Zkp.instance._malloc(result["length"] * result["BYTES_PER_ELEMENT"]);
			
			var secretKeyBuffer = Secp256k1Zkp.instance._malloc(secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(secretKey, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"]);
			
			var tweakBuffer = Secp256k1Zkp.instance._malloc(tweak["length"] * tweak["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(tweak, tweakBuffer / tweak["BYTES_PER_ELEMENT"]);
			
			// Check if performing secret key tweak multiply failed
			if(Secp256k1Zkp.instance._secretKeyTweakMultiply(resultBuffer, secretKeyBuffer, secretKey["length"] * secretKey["BYTES_PER_ELEMENT"], tweakBuffer, tweak["length"] * tweak["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, tweakBuffer / tweak["BYTES_PER_ELEMENT"], tweakBuffer / tweak["BYTES_PER_ELEMENT"] + tweak["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(resultBuffer);
				Secp256k1Zkp.instance._free(secretKeyBuffer);
				Secp256k1Zkp.instance._free(tweakBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, tweakBuffer / tweak["BYTES_PER_ELEMENT"], tweakBuffer / tweak["BYTES_PER_ELEMENT"] + tweak["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(resultBuffer);
			Secp256k1Zkp.instance._free(secretKeyBuffer);
			Secp256k1Zkp.instance._free(tweakBuffer);
			
			// Return result
			return result;
		}
		
		// Public key tweak multiply
		static publicKeyTweakMultiply(publicKey, tweak) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize result to size of public key
			var result = new Uint8Array(Secp256k1Zkp.instance._publicKeySize());
			
			// Allocate and fill memory
			var resultBuffer = Secp256k1Zkp.instance._malloc(result["length"] * result["BYTES_PER_ELEMENT"]);
			
			var publicKeyBuffer = Secp256k1Zkp.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(publicKey, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"]);
			
			var tweakBuffer = Secp256k1Zkp.instance._malloc(tweak["length"] * tweak["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(tweak, tweakBuffer / tweak["BYTES_PER_ELEMENT"]);
			
			// Check if performing public key tweak multiply failed
			if(Secp256k1Zkp.instance._publicKeyTweakMultiply(resultBuffer, publicKeyBuffer, publicKey["length"] * publicKey["BYTES_PER_ELEMENT"], tweakBuffer, tweak["length"] * tweak["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, tweakBuffer / tweak["BYTES_PER_ELEMENT"], tweakBuffer / tweak["BYTES_PER_ELEMENT"] + tweak["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(resultBuffer);
				Secp256k1Zkp.instance._free(publicKeyBuffer);
				Secp256k1Zkp.instance._free(tweakBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, tweakBuffer / tweak["BYTES_PER_ELEMENT"], tweakBuffer / tweak["BYTES_PER_ELEMENT"] + tweak["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(resultBuffer);
			Secp256k1Zkp.instance._free(publicKeyBuffer);
			Secp256k1Zkp.instance._free(tweakBuffer);
			
			// Return result
			return result;
		}
		
		// Shared secret key from secret key and public key
		static sharedSecretKeyFromSecretKeyAndPublicKey(secretKey, publicKey) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize shared secret key to size of secret key
			var sharedSecretKey = new Uint8Array(Secp256k1Zkp.instance._secretKeySize());
			
			// Allocate and fill memory
			var sharedSecretKeyBuffer = Secp256k1Zkp.instance._malloc(sharedSecretKey["length"] * sharedSecretKey["BYTES_PER_ELEMENT"]);
			
			var secretKeyBuffer = Secp256k1Zkp.instance._malloc(secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(secretKey, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"]);
			
			var publicKeyBuffer = Secp256k1Zkp.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(publicKey, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"]);
			
			// Check if getting shared secret key from secret key and public key failed
			if(Secp256k1Zkp.instance._sharedSecretKeyFromSecretKeyAndPublicKey(sharedSecretKeyBuffer, secretKeyBuffer, secretKey["length"] * secretKey["BYTES_PER_ELEMENT"], publicKeyBuffer, publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, sharedSecretKeyBuffer / sharedSecretKey["BYTES_PER_ELEMENT"], sharedSecretKeyBuffer / sharedSecretKey["BYTES_PER_ELEMENT"] + sharedSecretKey["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			
				// Free memory
				Secp256k1Zkp.instance._free(sharedSecretKeyBuffer);
				Secp256k1Zkp.instance._free(secretKeyBuffer);
				Secp256k1Zkp.instance._free(publicKeyBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get shared secret key
			sharedSecretKey = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(sharedSecretKeyBuffer, sharedSecretKeyBuffer + sharedSecretKey["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, sharedSecretKeyBuffer / sharedSecretKey["BYTES_PER_ELEMENT"], sharedSecretKeyBuffer / sharedSecretKey["BYTES_PER_ELEMENT"] + sharedSecretKey["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(sharedSecretKeyBuffer);
			Secp256k1Zkp.instance._free(secretKeyBuffer);
			Secp256k1Zkp.instance._free(publicKeyBuffer);
			
			// Return shared secret key
			return sharedSecretKey;
		}
		
		// Pedersen commit
		static pedersenCommit(blind, value) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize result to size of commit
			var result = new Uint8Array(Secp256k1Zkp.instance._commitSize());
			
			// Allocate and fill memory
			var resultBuffer = Secp256k1Zkp.instance._malloc(result["length"] * result["BYTES_PER_ELEMENT"]);
			
			var blindBuffer = Secp256k1Zkp.instance._malloc(blind["length"] * blind["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(blind, blindBuffer / blind["BYTES_PER_ELEMENT"]);
			
			var cStringValue = Secp256k1Zkp.stringToCString(value);
			var valueBuffer = Secp256k1Zkp.instance._malloc(cStringValue["length"] * cStringValue["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(cStringValue, valueBuffer / cStringValue["BYTES_PER_ELEMENT"]);
			cStringValue.fill(0);
			
			// Check if performing Pedersen commit failed
			if(Secp256k1Zkp.instance._pedersenCommit(resultBuffer, blindBuffer, blind["length"] * blind["BYTES_PER_ELEMENT"], valueBuffer) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, blindBuffer / blind["BYTES_PER_ELEMENT"], blindBuffer / blind["BYTES_PER_ELEMENT"] + blind["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, valueBuffer / cStringValue["BYTES_PER_ELEMENT"], valueBuffer / cStringValue["BYTES_PER_ELEMENT"] + cStringValue["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(resultBuffer);
				Secp256k1Zkp.instance._free(blindBuffer);
				Secp256k1Zkp.instance._free(valueBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, blindBuffer / blind["BYTES_PER_ELEMENT"], blindBuffer / blind["BYTES_PER_ELEMENT"] + blind["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, valueBuffer / cStringValue["BYTES_PER_ELEMENT"], valueBuffer / cStringValue["BYTES_PER_ELEMENT"] + cStringValue["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(resultBuffer);
			Secp256k1Zkp.instance._free(blindBuffer);
			Secp256k1Zkp.instance._free(valueBuffer);
			
			// Return result
			return result;
		}
		
		// Pedersen commit sum
		static pedersenCommitSum(positiveCommits, negativeCommits) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize result to size of commit
			var result = new Uint8Array(Secp256k1Zkp.instance._commitSize());
			
			// Allocate and fill memory
			var resultBuffer = Secp256k1Zkp.instance._malloc(result["length"] * result["BYTES_PER_ELEMENT"]);
			
			var positiveCommitsLength = positiveCommits.reduce(function(positiveCommitsLength, positiveCommit) {
			
				// Return length of positive commit added to total
				return positiveCommitsLength + positiveCommit["length"];
				
			}, 0);
			
			var positiveCommitsBuffer = Secp256k1Zkp.instance._malloc(positiveCommitsLength * Uint8Array["BYTES_PER_ELEMENT"]);
			
			// Go through all positive commits
			var positiveCommitsOffset = 0;
			for(var i = 0; i < positiveCommits["length"]; ++i) {
			
				// Set positive commit in memory at offset
				Secp256k1Zkp.instance["HEAPU8"].set(positiveCommits[i], positiveCommitsBuffer / Uint8Array["BYTES_PER_ELEMENT"] + positiveCommitsOffset);
				
				// Update offset
				positiveCommitsOffset += positiveCommits[i]["length"];
			}
			
			var positiveCommitsSizesBuffer = Secp256k1Zkp.instance._malloc(positiveCommits["length"] * Uint32Array["BYTES_PER_ELEMENT"]);
			
			for(var i = 0; i < positiveCommits["length"]; ++i)
				Secp256k1Zkp.instance["HEAPU32"].set(new Uint32Array([positiveCommits[i]["length"]]), positiveCommitsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + i);
			
			var negativeCommitsLength = negativeCommits.reduce(function(negativeCommitsLength, negativeCommit) {
			
				// Return length of negative commit added to total
				return negativeCommitsLength + negativeCommit["length"];
				
			}, 0);
			
			var negativeCommitsBuffer = Secp256k1Zkp.instance._malloc(negativeCommitsLength * Uint8Array["BYTES_PER_ELEMENT"]);
			
			// Go through all negative commits
			var negativeCommitsOffset = 0;
			for(var i = 0; i < negativeCommits["length"]; ++i) {
			
				// Set negative commit in memory at offset
				Secp256k1Zkp.instance["HEAPU8"].set(negativeCommits[i], negativeCommitsBuffer / Uint8Array["BYTES_PER_ELEMENT"] + negativeCommitsOffset);
				
				// Update offset
				negativeCommitsOffset += negativeCommits[i]["length"];
			}
			
			var negativeCommitsSizesBuffer = Secp256k1Zkp.instance._malloc(negativeCommits["length"] * Uint32Array["BYTES_PER_ELEMENT"]);
			
			for(var i = 0; i < negativeCommits["length"]; ++i)
				Secp256k1Zkp.instance["HEAPU32"].set(new Uint32Array([negativeCommits[i]["length"]]), negativeCommitsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + i);
			
			// Check if performing Pedersen commit sum failed
			if(Secp256k1Zkp.instance._pedersenCommitSum(resultBuffer, positiveCommitsBuffer, positiveCommitsSizesBuffer, positiveCommits["length"], negativeCommitsBuffer, negativeCommitsSizesBuffer, negativeCommits["length"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, positiveCommitsBuffer / Uint8Array["BYTES_PER_ELEMENT"], positiveCommitsBuffer / Uint8Array["BYTES_PER_ELEMENT"] + positiveCommitsLength);
				Secp256k1Zkp.instance["HEAPU32"].fill(0, positiveCommitsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"], positiveCommitsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + positiveCommits["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, negativeCommitsBuffer / Uint8Array["BYTES_PER_ELEMENT"], negativeCommitsBuffer / Uint8Array["BYTES_PER_ELEMENT"] + negativeCommitsLength);
				Secp256k1Zkp.instance["HEAPU32"].fill(0, negativeCommitsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"], negativeCommitsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + negativeCommits["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(resultBuffer);
				Secp256k1Zkp.instance._free(positiveCommitsBuffer);
				Secp256k1Zkp.instance._free(positiveCommitsSizesBuffer);
				Secp256k1Zkp.instance._free(negativeCommitsBuffer);
				Secp256k1Zkp.instance._free(negativeCommitsSizesBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, positiveCommitsBuffer / Uint8Array["BYTES_PER_ELEMENT"], positiveCommitsBuffer / Uint8Array["BYTES_PER_ELEMENT"] + positiveCommitsLength);
			Secp256k1Zkp.instance["HEAPU32"].fill(0, positiveCommitsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"], positiveCommitsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + positiveCommits["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, negativeCommitsBuffer / Uint8Array["BYTES_PER_ELEMENT"], negativeCommitsBuffer / Uint8Array["BYTES_PER_ELEMENT"] + negativeCommitsLength);
			Secp256k1Zkp.instance["HEAPU32"].fill(0, negativeCommitsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"], negativeCommitsSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + negativeCommits["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(resultBuffer);
			Secp256k1Zkp.instance._free(positiveCommitsBuffer);
			Secp256k1Zkp.instance._free(positiveCommitsSizesBuffer);
			Secp256k1Zkp.instance._free(negativeCommitsBuffer);
			Secp256k1Zkp.instance._free(negativeCommitsSizesBuffer);
			
			// Return result
			return result;
		}
		
		// Pedersen commit to public key
		static pedersenCommitToPublicKey(commit) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize public key to size of public key
			var publicKey = new Uint8Array(Secp256k1Zkp.instance._publicKeySize());
			
			// Allocate and fill memory
			var publicKeyBuffer = Secp256k1Zkp.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			
			var commitBuffer = Secp256k1Zkp.instance._malloc(commit["length"] * commit["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(commit, commitBuffer / commit["BYTES_PER_ELEMENT"]);
			
			// Check if getting public key from Pedersen commit failed
			if(Secp256k1Zkp.instance._pedersenCommitToPublicKey(publicKeyBuffer, commitBuffer, commit["length"] * commit["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, commitBuffer / commit["BYTES_PER_ELEMENT"], commitBuffer / commit["BYTES_PER_ELEMENT"] + commit["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(publicKeyBuffer);
				Secp256k1Zkp.instance._free(commitBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get public key
			publicKey = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(publicKeyBuffer, publicKeyBuffer + publicKey["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, commitBuffer / commit["BYTES_PER_ELEMENT"], commitBuffer / commit["BYTES_PER_ELEMENT"] + commit["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(publicKeyBuffer);
			Secp256k1Zkp.instance._free(commitBuffer);
			
			// Return public key
			return publicKey;
		}
		
		// Public key to Pedersen commit
		static publicKeyToPedersenCommit(publicKey) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize commit to size of commit
			var commit = new Uint8Array(Secp256k1Zkp.instance._commitSize());
			
			// Allocate and fill memory
			var commitBuffer = Secp256k1Zkp.instance._malloc(commit["length"] * commit["BYTES_PER_ELEMENT"]);
			
			var publicKeyBuffer = Secp256k1Zkp.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(publicKey, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"]);
			
			// Check if getting Pedersen commit from public key failed
			if(Secp256k1Zkp.instance._publicKeyToPedersenCommit(commitBuffer, publicKeyBuffer, publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, commitBuffer / commit["BYTES_PER_ELEMENT"], commitBuffer / commit["BYTES_PER_ELEMENT"] + commit["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(commitBuffer);
				Secp256k1Zkp.instance._free(publicKeyBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get commit
			commit = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(commitBuffer, commitBuffer + commit["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, commitBuffer / commit["BYTES_PER_ELEMENT"], commitBuffer / commit["BYTES_PER_ELEMENT"] + commit["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(commitBuffer);
			Secp256k1Zkp.instance._free(publicKeyBuffer);
			
			// Return commit
			return commit;
		}
		
		// Create single-signer signature
		static createSingleSignerSignature(message, secretKey, secretNonce, publicKey, publicNonce, publicNonceTotal) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize signature to size of single-signer signature
			var signature = new Uint8Array(Secp256k1Zkp.instance._singleSignerSignatureSize());
			
			// Initialize seed to size of seed
			var seed = new Uint8Array(Secp256k1Zkp.instance._seedSize());
			
			// Fill seed with random values
			crypto.getRandomValues(seed);
			
			// Allocate and fill memory
			var signatureBuffer = Secp256k1Zkp.instance._malloc(signature["length"] * signature["BYTES_PER_ELEMENT"]);
			
			var messageBuffer = Secp256k1Zkp.instance._malloc(message["length"] * message["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(message, messageBuffer / message["BYTES_PER_ELEMENT"]);
			
			var secretKeyBuffer = Secp256k1Zkp.instance._malloc(secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(secretKey, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"]);
			
			if(secretNonce !== Secp256k1Zkp.NO_SECRET_NONCE) {
				var secretNonceBuffer = Secp256k1Zkp.instance._malloc(secretNonce["length"] * secretNonce["BYTES_PER_ELEMENT"]);
				Secp256k1Zkp.instance["HEAPU8"].set(secretNonce, secretNonceBuffer / secretNonce["BYTES_PER_ELEMENT"]);
			}
			
			var publicKeyBuffer = Secp256k1Zkp.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(publicKey, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"]);
			
			if(publicNonce !== Secp256k1Zkp.NO_PUBLIC_NONCE) {
				var publicNonceBuffer = Secp256k1Zkp.instance._malloc(publicNonce["length"] * publicNonce["BYTES_PER_ELEMENT"]);
				Secp256k1Zkp.instance["HEAPU8"].set(publicNonce, publicNonceBuffer / publicNonce["BYTES_PER_ELEMENT"]);
			}
			
			if(publicNonceTotal !== Secp256k1Zkp.NO_PUBLIC_NONCE_TOTAL) {
				var publicNonceTotalBuffer = Secp256k1Zkp.instance._malloc(publicNonceTotal["length"] * publicNonceTotal["BYTES_PER_ELEMENT"]);
				Secp256k1Zkp.instance["HEAPU8"].set(publicNonceTotal, publicNonceTotalBuffer / publicNonceTotal["BYTES_PER_ELEMENT"]);
			}
			
			var seedBuffer = Secp256k1Zkp.instance._malloc(seed["length"] * seed["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(seed, seedBuffer / seed["BYTES_PER_ELEMENT"]);
			
			// Check if creating single-signer signature failed
			if(Secp256k1Zkp.instance._createSingleSignerSignature(signatureBuffer, messageBuffer, message["length"] * message["BYTES_PER_ELEMENT"], secretKeyBuffer, secretKey["length"] * secretKey["BYTES_PER_ELEMENT"], (secretNonce !== Secp256k1Zkp.NO_SECRET_NONCE) ? secretNonceBuffer : Secp256k1Zkp.C_NULL, (secretNonce !== Secp256k1Zkp.NO_SECRET_NONCE) ? secretNonce["length"] * secretNonce["BYTES_PER_ELEMENT"] : 0, publicKeyBuffer, publicKey["length"] * publicKey["BYTES_PER_ELEMENT"], (publicNonce !== Secp256k1Zkp.NO_PUBLIC_NONCE) ? publicNonceBuffer : Secp256k1Zkp.C_NULL, (publicNonce !== Secp256k1Zkp.NO_PUBLIC_NONCE) ? publicNonce["length"] * publicNonce["BYTES_PER_ELEMENT"] : 0, (publicNonceTotal !== Secp256k1Zkp.NO_PUBLIC_NONCE_TOTAL) ? publicNonceTotalBuffer : Secp256k1Zkp.C_NULL, (publicNonceTotal !== Secp256k1Zkp.NO_PUBLIC_NONCE_TOTAL) ? publicNonceTotal["length"] * publicNonceTotal["BYTES_PER_ELEMENT"] : 0, seedBuffer, seed["length"] * seed["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, messageBuffer / message["BYTES_PER_ELEMENT"], messageBuffer / message["BYTES_PER_ELEMENT"] + message["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
				
				if(secretNonce !== Secp256k1Zkp.NO_SECRET_NONCE)
					Secp256k1Zkp.instance["HEAPU8"].fill(0, secretNonceBuffer / secretNonce["BYTES_PER_ELEMENT"], secretNonceBuffer / secretNonce["BYTES_PER_ELEMENT"] + secretNonce["length"]);
				
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				
				if(publicNonce !== Secp256k1Zkp.NO_PUBLIC_NONCE)
					Secp256k1Zkp.instance["HEAPU8"].fill(0, publicNonceBuffer / publicNonce["BYTES_PER_ELEMENT"], publicNonceBuffer / publicNonce["BYTES_PER_ELEMENT"] + publicNonce["length"]);
				
				if(publicNonceTotal !== Secp256k1Zkp.NO_PUBLIC_NONCE_TOTAL)
					Secp256k1Zkp.instance["HEAPU8"].fill(0, publicNonceTotalBuffer / publicNonceTotal["BYTES_PER_ELEMENT"], publicNonceTotalBuffer / publicNonceTotal["BYTES_PER_ELEMENT"] + publicNonceTotal["length"]);
				
				Secp256k1Zkp.instance["HEAPU8"].fill(0, seedBuffer / seed["BYTES_PER_ELEMENT"], seedBuffer / seed["BYTES_PER_ELEMENT"] + seed["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(signatureBuffer);
				Secp256k1Zkp.instance._free(messageBuffer);
				Secp256k1Zkp.instance._free(secretKeyBuffer);
				
				if(secretNonce !== Secp256k1Zkp.NO_SECRET_NONCE)
					Secp256k1Zkp.instance._free(secretNonceBuffer);
				
				Secp256k1Zkp.instance._free(publicKeyBuffer);
				
				if(publicNonce !== Secp256k1Zkp.NO_PUBLIC_NONCE)
					Secp256k1Zkp.instance._free(publicNonceBuffer);
				
				if(publicNonceTotal !== Secp256k1Zkp.NO_PUBLIC_NONCE_TOTAL)
					Secp256k1Zkp.instance._free(publicNonceTotalBuffer);
				
				Secp256k1Zkp.instance._free(seedBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get signature
			signature = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(signatureBuffer, signatureBuffer + signature["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, messageBuffer / message["BYTES_PER_ELEMENT"], messageBuffer / message["BYTES_PER_ELEMENT"] + message["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
			
			if(secretNonce !== Secp256k1Zkp.NO_SECRET_NONCE)
				Secp256k1Zkp.instance["HEAPU8"].fill(0, secretNonceBuffer / secretNonce["BYTES_PER_ELEMENT"], secretNonceBuffer / secretNonce["BYTES_PER_ELEMENT"] + secretNonce["length"]);
			
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			
			if(publicNonce !== Secp256k1Zkp.NO_PUBLIC_NONCE)
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicNonceBuffer / publicNonce["BYTES_PER_ELEMENT"], publicNonceBuffer / publicNonce["BYTES_PER_ELEMENT"] + publicNonce["length"]);
			
			if(publicNonceTotal !== Secp256k1Zkp.NO_PUBLIC_NONCE_TOTAL)
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicNonceTotalBuffer / publicNonceTotal["BYTES_PER_ELEMENT"], publicNonceTotalBuffer / publicNonceTotal["BYTES_PER_ELEMENT"] + publicNonceTotal["length"]);
			
			Secp256k1Zkp.instance["HEAPU8"].fill(0, seedBuffer / seed["BYTES_PER_ELEMENT"], seedBuffer / seed["BYTES_PER_ELEMENT"] + seed["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(signatureBuffer);
			Secp256k1Zkp.instance._free(messageBuffer);
			Secp256k1Zkp.instance._free(secretKeyBuffer);
			
			if(secretNonce !== Secp256k1Zkp.NO_SECRET_NONCE)
				Secp256k1Zkp.instance._free(secretNonceBuffer);
			
			Secp256k1Zkp.instance._free(publicKeyBuffer);
			
			if(publicNonce !== Secp256k1Zkp.NO_PUBLIC_NONCE)
				Secp256k1Zkp.instance._free(publicNonceBuffer);
			
			if(publicNonceTotal !== Secp256k1Zkp.NO_PUBLIC_NONCE_TOTAL)
				Secp256k1Zkp.instance._free(publicNonceTotalBuffer);
			
			Secp256k1Zkp.instance._free(seedBuffer);
			
			// Return signature
			return signature;
		}
		
		// Add single-signer signatures
		static addSingleSignerSignatures(signatures, publicNonceTotal) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize result to size of single-signer signature
			var result = new Uint8Array(Secp256k1Zkp.instance._singleSignerSignatureSize());
			
			// Allocate and fill memory
			var resultBuffer = Secp256k1Zkp.instance._malloc(result["length"] * result["BYTES_PER_ELEMENT"]);
			
			var signaturesLength = signatures.reduce(function(signaturesLength, signature) {
			
				// Return length of signature added to total
				return signaturesLength + signature["length"];
				
			}, 0);
			
			var signaturesBuffer = Secp256k1Zkp.instance._malloc(signaturesLength * Uint8Array["BYTES_PER_ELEMENT"]);
			
			// Go through all signatures
			var signaturesOffset = 0;
			for(var i = 0; i < signatures["length"]; ++i) {
			
				// Set signature in memory at offset
				Secp256k1Zkp.instance["HEAPU8"].set(signatures[i], signaturesBuffer / Uint8Array["BYTES_PER_ELEMENT"] + signaturesOffset);
				
				// Update offset
				signaturesOffset += signatures[i]["length"];
			}
			
			var signaturesSizesBuffer = Secp256k1Zkp.instance._malloc(signatures["length"] * Uint32Array["BYTES_PER_ELEMENT"]);
			
			for(var i = 0; i < signatures["length"]; ++i)
				Secp256k1Zkp.instance["HEAPU32"].set(new Uint32Array([signatures[i]["length"]]), signaturesSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + i);
			
			var publicNonceTotalBuffer = Secp256k1Zkp.instance._malloc(publicNonceTotal["length"] * publicNonceTotal["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(publicNonceTotal, publicNonceTotalBuffer / publicNonceTotal["BYTES_PER_ELEMENT"]);
			
			// Check if adding single-signer signatures failed
			if(Secp256k1Zkp.instance._addSingleSignerSignatures(resultBuffer, signaturesBuffer, signaturesSizesBuffer, signatures["length"], publicNonceTotalBuffer, publicNonceTotal["length"] * publicNonceTotal["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, signaturesBuffer / Uint8Array["BYTES_PER_ELEMENT"], signaturesBuffer / Uint8Array["BYTES_PER_ELEMENT"] + signaturesLength);
				Secp256k1Zkp.instance["HEAPU32"].fill(0, signaturesSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"], signaturesSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + signatures["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicNonceTotalBuffer / publicNonceTotal["BYTES_PER_ELEMENT"], publicNonceTotalBuffer / publicNonceTotal["BYTES_PER_ELEMENT"] + publicNonceTotal["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(resultBuffer);
				Secp256k1Zkp.instance._free(signaturesBuffer);
				Secp256k1Zkp.instance._free(signaturesSizesBuffer);
				Secp256k1Zkp.instance._free(publicNonceTotalBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, signaturesBuffer / Uint8Array["BYTES_PER_ELEMENT"], signaturesBuffer / Uint8Array["BYTES_PER_ELEMENT"] + signaturesLength);
			Secp256k1Zkp.instance["HEAPU32"].fill(0, signaturesSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"], signaturesSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + signatures["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicNonceTotalBuffer / publicNonceTotal["BYTES_PER_ELEMENT"], publicNonceTotalBuffer / publicNonceTotal["BYTES_PER_ELEMENT"] + publicNonceTotal["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(resultBuffer);
			Secp256k1Zkp.instance._free(signaturesBuffer);
			Secp256k1Zkp.instance._free(signaturesSizesBuffer);
			Secp256k1Zkp.instance._free(publicNonceTotalBuffer);
			
			// Return result
			return result;
		}
		
		// Verify single-signer signature
		static verifySingleSignerSignature(signature, message, publicNonce, publicKey, publicKeyTotal, isPartial) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Allocate and fill memory
			var signatureBuffer = Secp256k1Zkp.instance._malloc(signature["length"] * signature["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(signature, signatureBuffer / signature["BYTES_PER_ELEMENT"]);
			
			if(publicNonce !== Secp256k1Zkp.NO_PUBLIC_NONCE) {
				var publicNonceBuffer = Secp256k1Zkp.instance._malloc(publicNonce["length"] * publicNonce["BYTES_PER_ELEMENT"]);
				Secp256k1Zkp.instance["HEAPU8"].set(publicNonce, publicNonceBuffer / publicNonce["BYTES_PER_ELEMENT"]);
			}
			
			var messageBuffer = Secp256k1Zkp.instance._malloc(message["length"] * message["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(message, messageBuffer / message["BYTES_PER_ELEMENT"]);
			
			var publicKeyBuffer = Secp256k1Zkp.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(publicKey, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"]);
			
			var publicKeyTotalBuffer = Secp256k1Zkp.instance._malloc(publicKeyTotal["length"] * publicKeyTotal["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(publicKeyTotal, publicKeyTotalBuffer / publicKeyTotal["BYTES_PER_ELEMENT"]);
			
			// Check if single-signer signature isn't verified
			if(Secp256k1Zkp.instance._verifySingleSignerSignature(signatureBuffer, signature["length"] * signature["BYTES_PER_ELEMENT"], messageBuffer, message["length"] * message["BYTES_PER_ELEMENT"], (publicNonce !== Secp256k1Zkp.NO_PUBLIC_NONCE) ? publicNonceBuffer : Secp256k1Zkp.C_NULL, (publicNonce !== Secp256k1Zkp.NO_PUBLIC_NONCE) ? publicNonce["length"] * publicNonce["BYTES_PER_ELEMENT"] : 0, publicKeyBuffer, publicKey["length"] * publicKey["BYTES_PER_ELEMENT"], publicKeyTotalBuffer, publicKeyTotal["length"] * publicKeyTotal["BYTES_PER_ELEMENT"], Secp256k1Zkp.booleanToCBoolean(isPartial)) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
				
				if(publicNonce !== Secp256k1Zkp.NO_PUBLIC_NONCE)
					Secp256k1Zkp.instance["HEAPU8"].fill(0, publicNonceBuffer / publicNonce["BYTES_PER_ELEMENT"], publicNonceBuffer / publicNonce["BYTES_PER_ELEMENT"] + publicNonce["length"]);
				
				Secp256k1Zkp.instance["HEAPU8"].fill(0, messageBuffer / message["BYTES_PER_ELEMENT"], messageBuffer / message["BYTES_PER_ELEMENT"] + message["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyTotalBuffer / publicKeyTotal["BYTES_PER_ELEMENT"], publicKeyTotalBuffer / publicKeyTotal["BYTES_PER_ELEMENT"] + publicKeyTotal["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(signatureBuffer);
				
				if(publicNonce !== Secp256k1Zkp.NO_PUBLIC_NONCE)
					Secp256k1Zkp.instance._free(publicNonceBuffer);
				
				Secp256k1Zkp.instance._free(messageBuffer);
				Secp256k1Zkp.instance._free(publicKeyBuffer);
				Secp256k1Zkp.instance._free(publicKeyTotalBuffer);
			
				// Return false
				return false;
			}
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
			
			if(publicNonce !== Secp256k1Zkp.NO_PUBLIC_NONCE)
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicNonceBuffer / publicNonce["BYTES_PER_ELEMENT"], publicNonceBuffer / publicNonce["BYTES_PER_ELEMENT"] + publicNonce["length"]);
			
			Secp256k1Zkp.instance["HEAPU8"].fill(0, messageBuffer / message["BYTES_PER_ELEMENT"], messageBuffer / message["BYTES_PER_ELEMENT"] + message["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyTotalBuffer / publicKeyTotal["BYTES_PER_ELEMENT"], publicKeyTotalBuffer / publicKeyTotal["BYTES_PER_ELEMENT"] + publicKeyTotal["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(signatureBuffer);
			
			if(publicNonce !== Secp256k1Zkp.NO_PUBLIC_NONCE)
				Secp256k1Zkp.instance._free(publicNonceBuffer);
			
			Secp256k1Zkp.instance._free(messageBuffer);
			Secp256k1Zkp.instance._free(publicKeyBuffer);
			Secp256k1Zkp.instance._free(publicKeyTotalBuffer);
			
			// Return true
			return true;
		}
		
		// Single-signer signature from data
		static singleSignerSignatureFromData(data) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize signature to size of single-signer signature
			var signature = new Uint8Array(Secp256k1Zkp.instance._singleSignerSignatureSize());
			
			// Allocate and fill memory
			var signatureBuffer = Secp256k1Zkp.instance._malloc(signature["length"] * signature["BYTES_PER_ELEMENT"]);
			
			var dataBuffer = Secp256k1Zkp.instance._malloc(data["length"] * data["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(data, dataBuffer / data["BYTES_PER_ELEMENT"]);
			
			// Check if getting single-signer signature from data failed
			if(Secp256k1Zkp.instance._singleSignerSignatureFromData(signatureBuffer, dataBuffer, data["length"] * data["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, dataBuffer / data["BYTES_PER_ELEMENT"], dataBuffer / data["BYTES_PER_ELEMENT"] + data["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(signatureBuffer);
				Secp256k1Zkp.instance._free(dataBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get signature
			signature = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(signatureBuffer, signatureBuffer + signature["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, dataBuffer / data["BYTES_PER_ELEMENT"], dataBuffer / data["BYTES_PER_ELEMENT"] + data["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(signatureBuffer);
			Secp256k1Zkp.instance._free(dataBuffer);
			
			// Return signature
			return signature;
		}
		
		// Compact single-signer signature
		static compactSingleSignerSignature(signature) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize result to size of single-signer signature
			var result = new Uint8Array(Secp256k1Zkp.instance._singleSignerSignatureSize());
			
			// Allocate and fill memory
			var resultBuffer = Secp256k1Zkp.instance._malloc(signature["length"] * signature["BYTES_PER_ELEMENT"]);
			
			var signatureBuffer = Secp256k1Zkp.instance._malloc(signature["length"] * signature["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(signature, signatureBuffer / signature["BYTES_PER_ELEMENT"]);
			
			// Check if compacting single-signer signature failed
			if(Secp256k1Zkp.instance._compactSingleSignerSignature(resultBuffer, signatureBuffer, signature["length"] * signature["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(resultBuffer);
				Secp256k1Zkp.instance._free(signatureBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(resultBuffer);
			Secp256k1Zkp.instance._free(signatureBuffer);
			
			// Return result
			return result;
		}
		
		// Uncompact single-signer signature
		static uncompactSingleSignerSignature(signature) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize result to size of uncompact single-signer signature
			var result = new Uint8Array(Secp256k1Zkp.instance._uncompactSingleSignerSignatureSize());
			
			// Allocate and fill memory
			var resultBuffer = Secp256k1Zkp.instance._malloc(signature["length"] * signature["BYTES_PER_ELEMENT"]);
			
			var signatureBuffer = Secp256k1Zkp.instance._malloc(signature["length"] * signature["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(signature, signatureBuffer / signature["BYTES_PER_ELEMENT"]);
			
			// Check if uncompacting single-signer signature failed
			if(Secp256k1Zkp.instance._uncompactSingleSignerSignature(resultBuffer, signatureBuffer, signature["length"] * signature["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(resultBuffer);
				Secp256k1Zkp.instance._free(signatureBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(resultBuffer);
			Secp256k1Zkp.instance._free(signatureBuffer);
			
			// Return result
			return result;
		}
		
		// Combine public keys
		static combinePublicKeys(publicKeys) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize result to size of public key
			var result = new Uint8Array(Secp256k1Zkp.instance._publicKeySize());
			
			// Allocate and fill memory
			var resultBuffer = Secp256k1Zkp.instance._malloc(result["length"] * result["BYTES_PER_ELEMENT"]);
			
			var publicKeysLength = publicKeys.reduce(function(publicKeysLength, publicKey) {
			
				// Return length of public key added to total
				return publicKeysLength + publicKey["length"];
				
			}, 0);
			
			var publicKeysBuffer = Secp256k1Zkp.instance._malloc(publicKeysLength * Uint8Array["BYTES_PER_ELEMENT"]);
			
			// Go through all public keys
			var publicKeysOffset = 0;
			for(var i = 0; i < publicKeys["length"]; ++i) {
			
				// Set public key in memory at offset
				Secp256k1Zkp.instance["HEAPU8"].set(publicKeys[i], publicKeysBuffer / Uint8Array["BYTES_PER_ELEMENT"] + publicKeysOffset);
				
				// Update offset
				publicKeysOffset += publicKeys[i]["length"];
			}
			
			var publicKeysSizesBuffer = Secp256k1Zkp.instance._malloc(publicKeys["length"] * Uint32Array["BYTES_PER_ELEMENT"]);
			
			for(var i = 0; i < publicKeys["length"]; ++i)
				Secp256k1Zkp.instance["HEAPU32"].set(new Uint32Array([publicKeys[i]["length"]]), publicKeysSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + i);
			
			// Check if combining public keys failed
			if(Secp256k1Zkp.instance._combinePublicKeys(resultBuffer, publicKeysBuffer, publicKeysSizesBuffer, publicKeys["length"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeysBuffer / Uint8Array["BYTES_PER_ELEMENT"], publicKeysBuffer / Uint8Array["BYTES_PER_ELEMENT"] + publicKeysLength);
				Secp256k1Zkp.instance["HEAPU32"].fill(0, publicKeysSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"], publicKeysSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + publicKeys["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(resultBuffer);
				Secp256k1Zkp.instance._free(publicKeysBuffer);
				Secp256k1Zkp.instance._free(publicKeysSizesBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get result
			result = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(resultBuffer, resultBuffer + result["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, resultBuffer / result["BYTES_PER_ELEMENT"], resultBuffer / result["BYTES_PER_ELEMENT"] + result["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeysBuffer / Uint8Array["BYTES_PER_ELEMENT"], publicKeysBuffer / Uint8Array["BYTES_PER_ELEMENT"] + publicKeysLength);
			Secp256k1Zkp.instance["HEAPU32"].fill(0, publicKeysSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"], publicKeysSizesBuffer / Uint32Array["BYTES_PER_ELEMENT"] + publicKeys["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(resultBuffer);
			Secp256k1Zkp.instance._free(publicKeysBuffer);
			Secp256k1Zkp.instance._free(publicKeysSizesBuffer);
			
			// Return result
			return result;
		}
		
		// Create secret nonce
		static createSecretNonce() {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize nonce to size of nonce
			var nonce = new Uint8Array(Secp256k1Zkp.instance._nonceSize());
			
			// Initialize seed to size of seed
			var seed = new Uint8Array(Secp256k1Zkp.instance._seedSize());
			
			// Fill seed with random values
			crypto.getRandomValues(seed);
			
			// Allocate and fill memory
			var nonceBuffer = Secp256k1Zkp.instance._malloc(nonce["length"] * nonce["BYTES_PER_ELEMENT"]);
			
			var seedBuffer = Secp256k1Zkp.instance._malloc(seed["length"] * seed["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(seed, seedBuffer / seed["BYTES_PER_ELEMENT"]);
			
			// Check if creating secure nonce failed
			if(Secp256k1Zkp.instance._createSecretNonce(nonceBuffer, seedBuffer, seed["length"] * seed["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, nonceBuffer / nonce["BYTES_PER_ELEMENT"], nonceBuffer / nonce["BYTES_PER_ELEMENT"] + nonce["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, seedBuffer / seed["BYTES_PER_ELEMENT"], seedBuffer / seed["BYTES_PER_ELEMENT"] + seed["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(nonceBuffer);
				Secp256k1Zkp.instance._free(seedBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get nonce
			nonce = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(nonceBuffer, nonceBuffer + nonce["length"]));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, nonceBuffer / nonce["BYTES_PER_ELEMENT"], nonceBuffer / nonce["BYTES_PER_ELEMENT"] + nonce["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, seedBuffer / seed["BYTES_PER_ELEMENT"], seedBuffer / seed["BYTES_PER_ELEMENT"] + seed["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(nonceBuffer);
			Secp256k1Zkp.instance._free(seedBuffer);
			
			// Return nonce
			return nonce;
		}
		
		// Create message hash signature
		static createMessageHashSignature(messageHash, secretKey) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Initialize signature to maximum size of message hash signature
			var signature = new Uint8Array(Secp256k1Zkp.instance._maximumMessageHashSignatureSize());
			
			// Initialize signature size to size of a max 64-bit integer C string
			var signatureSize = new Uint8Array(Secp256k1Zkp.MAX_64_BIT_INTEGER_C_STRING["length"]);
			
			// Allocate and fill memory
			var signatureBuffer = Secp256k1Zkp.instance._malloc(signature["length"] * signature["BYTES_PER_ELEMENT"]);
			
			var signatureSizeBuffer = Secp256k1Zkp.instance._malloc(signatureSize["length"] * signatureSize["BYTES_PER_ELEMENT"]);
			
			var messageHashBuffer = Secp256k1Zkp.instance._malloc(messageHash["length"] * messageHash["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(messageHash, messageHashBuffer / messageHash["BYTES_PER_ELEMENT"]);
			
			var secretKeyBuffer = Secp256k1Zkp.instance._malloc(secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(secretKey, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"]);
			
			// Check if creating message hash signature failed
			if(Secp256k1Zkp.instance._createMessageHashSignature(signatureBuffer, signatureSizeBuffer, messageHashBuffer, messageHash["length"] * messageHash["BYTES_PER_ELEMENT"], secretKeyBuffer, secretKey["length"] * secretKey["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureSizeBuffer / signatureSize["BYTES_PER_ELEMENT"], signatureSizeBuffer / signatureSize["BYTES_PER_ELEMENT"] + signatureSize["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, messageHashBuffer / messageHash["BYTES_PER_ELEMENT"], messageHashBuffer / messageHash["BYTES_PER_ELEMENT"] + messageHash["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(signatureBuffer);
				Secp256k1Zkp.instance._free(signatureSizeBuffer);
				Secp256k1Zkp.instance._free(messageHashBuffer);
				Secp256k1Zkp.instance._free(secretKeyBuffer);
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			}
			
			// Get signature size
			signatureSize = Secp256k1Zkp.cStringToString(Secp256k1Zkp.instance["HEAPU8"].subarray(signatureSizeBuffer, signatureSizeBuffer + signatureSize["length"]));
			
			// Get signature
			signature = new Uint8Array(Secp256k1Zkp.instance["HEAPU8"].subarray(signatureBuffer, signatureBuffer + parseInt(signatureSize, Secp256k1Zkp.DECIMAL_NUMBER_BASE)));
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureSizeBuffer / signatureSize["BYTES_PER_ELEMENT"], signatureSizeBuffer / signatureSize["BYTES_PER_ELEMENT"] + signatureSize["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, messageHashBuffer / messageHash["BYTES_PER_ELEMENT"], messageHashBuffer / messageHash["BYTES_PER_ELEMENT"] + messageHash["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"], secretKeyBuffer / secretKey["BYTES_PER_ELEMENT"] + secretKey["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(signatureBuffer);
			Secp256k1Zkp.instance._free(signatureSizeBuffer);
			Secp256k1Zkp.instance._free(messageHashBuffer);
			Secp256k1Zkp.instance._free(secretKeyBuffer);
			
			// Return signature
			return signature;
		}
		
		// Verify message hash signature
		static verifyMessageHashSignature(signature, messageHash, publicKey) {
		
			// Check if instance doesn't exist
			if(typeof Secp256k1Zkp.instance === "undefined") {
			
				// Set instance
				Secp256k1Zkp.instance = secp256k1Zkp();
				
				// Check if initializing failed
				if(Secp256k1Zkp.instance._initialize() === Secp256k1Zkp.C_FALSE)
				
					// Set instance to invalid
					Secp256k1Zkp.instance = Secp256k1Zkp.INVALID;
			}
		
			// Check if instance is invalid
			if(Secp256k1Zkp.instance === Secp256k1Zkp.INVALID)
			
				// Return operation failed
				return Secp256k1Zkp.OPERATION_FAILED;
			
			// Allocate and fill memory
			var signatureBuffer = Secp256k1Zkp.instance._malloc(signature["length"] * signature["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(signature, signatureBuffer / signature["BYTES_PER_ELEMENT"]);
			
			var messageHashBuffer = Secp256k1Zkp.instance._malloc(messageHash["length"] * messageHash["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(messageHash, messageHashBuffer / messageHash["BYTES_PER_ELEMENT"]);
			
			var publicKeyBuffer = Secp256k1Zkp.instance._malloc(publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]);
			Secp256k1Zkp.instance["HEAPU8"].set(publicKey, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"]);
			
			// Check if message hash signature isn't verified
			if(Secp256k1Zkp.instance._verifyMessageHashSignature(signatureBuffer, signature["length"] * signature["BYTES_PER_ELEMENT"], messageHashBuffer, messageHash["length"] * messageHash["BYTES_PER_ELEMENT"], publicKeyBuffer, publicKey["length"] * publicKey["BYTES_PER_ELEMENT"]) === Secp256k1Zkp.C_FALSE) {
			
				// Clear memory
				Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, messageHashBuffer / messageHash["BYTES_PER_ELEMENT"], messageHashBuffer / messageHash["BYTES_PER_ELEMENT"] + messageHash["length"]);
				Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
				
				// Free memory
				Secp256k1Zkp.instance._free(signatureBuffer);
				Secp256k1Zkp.instance._free(messageHashBuffer);
				Secp256k1Zkp.instance._free(publicKeyBuffer);
			
				// Return false
				return false;
			}
			
			// Clear memory
			Secp256k1Zkp.instance["HEAPU8"].fill(0, signatureBuffer / signature["BYTES_PER_ELEMENT"], signatureBuffer / signature["BYTES_PER_ELEMENT"] + signature["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, messageHashBuffer / messageHash["BYTES_PER_ELEMENT"], messageHashBuffer / messageHash["BYTES_PER_ELEMENT"] + messageHash["length"]);
			Secp256k1Zkp.instance["HEAPU8"].fill(0, publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"], publicKeyBuffer / publicKey["BYTES_PER_ELEMENT"] + publicKey["length"]);
			
			// Free memory
			Secp256k1Zkp.instance._free(signatureBuffer);
			Secp256k1Zkp.instance._free(messageHashBuffer);
			Secp256k1Zkp.instance._free(publicKeyBuffer);
			
			// Return true
			return true;
		}
		
		// Operation failed
		static get OPERATION_FAILED() {
		
			// Return operation failed
			return null;
		}
		
		// No secret nonce
		static get NO_SECRET_NONCE() {
		
			// Return no secret nonce
			return null;
		}
		
		// No public nonce
		static get NO_PUBLIC_NONCE() {
		
			// Return no public nonce
			return null;
		}
		
		// No public nonce total
		static get NO_PUBLIC_NONCE_TOTAL() {
		
			// Return no public nonce total
			return null;
		}
	
	// Private
	
		// String to C string
		static stringToCString(string) {
		
			// Get UTF-8 string from string
			var utf8String = (new TextEncoder()).encode(string);
			
			// Append NULL terminator to UTF-8 string
			var nullTerminator = new Uint8Array([Secp256k1Zkp.NULL_TERMINATOR]);
			var cString = new Uint8Array(utf8String["length"] + nullTerminator["length"]);
			
			cString.set(utf8String);
			cString.set(nullTerminator, utf8String["length"]);
			
			// Clear memory
			utf8String.fill(0);
			
			// Return C string
			return cString;
		}
		
		// C string to string
		static cStringToString(cString) {
		
			// Get index of NULL terminator character in C string
			var nullTerminatorIndex = cString.findIndex(function(element, index, array) {
			
				// Return if the element is a NULL terminator
				return element === Secp256k1Zkp.NULL_TERMINATOR;
			});
			
			// Return string
			return (new TextDecoder()).decode(cString.subarray(0, nullTerminatorIndex));
		}
		
		// Boolean to C boolean
		static booleanToCBoolean(boolean) {
		
			// Return boolean as a C boolean
			return (boolean === true) ? Secp256k1Zkp.C_TRUE : Secp256k1Zkp.C_FALSE;
		}
		
		// NULL terminator
		static get NULL_TERMINATOR() {
		
			// Return NULL terminator
			return 0;
		}
		
		// Max 64-bit integer C string
		static get MAX_64_BIT_INTEGER_C_STRING() {
		
			// Return max 64-bit integer C string
			return "18446744073709551615\0";
		}
		
		// Invalid
		static get INVALID() {
		
			// Return invalid
			return null;
		}
		
		// C false
		static get C_FALSE() {
		
			// Return C false
			return 0;
		}
		
		// C true
		static get C_TRUE() {
		
			// Return C true
			return 1;
		}
		
		// C null
		static get C_NULL() {
		
			// Return C null
			return null;
		}
		
		// Decimal number base
		static get DECIMAL_NUMBER_BASE() {
		
			// Return decimal number base
			return 10;
		}
}


// Supporting fuction implementation

// Check if document doesn't exist
if(typeof document === "undefined") {

	// Create document
	var document = {};
}

// Check if module exports exists
if(typeof module === "object" && module !== null && "exports" in module === true) {

	// Exports
	module["exports"] = Secp256k1Zkp;
}
