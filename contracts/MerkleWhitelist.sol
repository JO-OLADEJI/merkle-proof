// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleWhitelist {
    bytes32 public merkleRoot;

    constructor(bytes32 _merkleRoot) {
        merkleRoot = _merkleRoot;
    }

    function checkInWhitelist(
        bytes32[] calldata _merkleProof,
        uint64 _maxAllowanceSlots
    ) external view returns (bool) {
        bytes32 leaf = keccak256(
            abi.encodePacked(msg.sender, _maxAllowanceSlots)
        );
        return MerkleProof.verify(_merkleProof, merkleRoot, leaf);
    }
}
