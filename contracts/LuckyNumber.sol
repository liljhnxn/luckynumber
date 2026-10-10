// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LuckyNumber
 * @author LuckyNumber Project
 * @notice Allows users to save and view their favourite number (1-100) on-chain.
 */
contract LuckyNumber {
    // Mapping from user address to their selected lucky number (1-100)
    mapping(address => uint256) private _numbers;

    // Mapping to track whether an address has chosen a lucky number
    mapping(address => bool) private _hasNumber;

    /**
     * @notice Emitted whenever a user sets or updates their favourite number.
     * @param user The address of the user who set their number.
     * @param number The chosen number (1-100).
     */
    event NumberUpdated(address indexed user, uint256 number);

    // Custom errors for clarity and gas efficiency
    error InvalidNumber(uint256 number);

    /**
     * @notice Allows a wallet to save or update its favourite number.
     * @dev Only accepts values between 1 and 100, inclusive.
     * @param number The favourite number to store.
     */
    function setNumber(uint256 number) external {
        if (number < 1 || number > 100) {
            revert InvalidNumber(number);
        }

        _numbers[msg.sender] = number;
        _hasNumber[msg.sender] = true;

        emit NumberUpdated(msg.sender, number);
    }

    /**
     * @notice Returns the number saved by a wallet.
     * @dev Returns 0 if the wallet has not saved a number.
     * @param user The wallet address to query.
     * @return The saved number, or 0 if unset.
     */
    function getNumber(address user) external view returns (uint256) {
        return _numbers[user];
    }

    /**
     * @notice Indicates whether a wallet has saved a number.
     * @param user The wallet address to query.
     * @return True if the wallet has set a number, false otherwise.
     */
    function hasNumber(address user) external view returns (bool) {
        return _hasNumber[user];
    }
}
