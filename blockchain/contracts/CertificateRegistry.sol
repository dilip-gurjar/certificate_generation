// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry {
    struct Certificate {
        bytes32 certificateHash;
        address issuer;
        uint256 issuedAt;
        bool revoked;
    }

    mapping(bytes32 => Certificate) public certificates;

    event CertificateRegistered(
        bytes32 indexed certificateHash,
        address indexed issuer,
        uint256 issuedAt
    );

    event CertificateRevoked(
        bytes32 indexed certificateHash
    );

    function registerCertificate(bytes32 _certificateHash) external {
        require(
            certificates[_certificateHash].issuedAt == 0,
            "Certificate already registered"
        );

        certificates[_certificateHash] = Certificate({
            certificateHash: _certificateHash,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            revoked: false
        });

        emit CertificateRegistered(
            _certificateHash,
            msg.sender,
            block.timestamp
        );
    }

    function revokeCertificate(bytes32 _certificateHash) external {
        Certificate storage certificate = certificates[_certificateHash];

        require(
            certificate.issuedAt != 0,
            "Certificate not found"
        );

        require(
            certificate.issuer == msg.sender,
            "Only issuer can revoke"
        );

        certificate.revoked = true;

        emit CertificateRevoked(_certificateHash);
    }

    function verifyCertificate(
        bytes32 _certificateHash
    )
        external
        view
        returns (
            bool exists,
            address issuer,
            uint256 issuedAt,
            bool revoked
        )
    {
        Certificate memory certificate = certificates[_certificateHash];

        if (certificate.issuedAt == 0) {
            return (false, address(0), 0, false);
        }

        return (
            true,
            certificate.issuer,
            certificate.issuedAt,
            certificate.revoked
        );
    }
}