import { expect } from "chai";
import hre from "hardhat";

describe("LuckyNumber Contract", function () {
  let luckyNumber;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await hre.ethers.getSigners();
    const LuckyNumberFactory = await hre.ethers.getContractFactory("LuckyNumber");
    luckyNumber = await LuckyNumberFactory.deploy();
    await luckyNumber.waitForDeployment();
  });

  describe("Saving Numbers", function () {
    it("should allow a wallet to save a valid number", async function () {
      await luckyNumber.connect(owner).setNumber(7);
      expect(await luckyNumber.hasNumber(owner.address)).to.equal(true);
      expect(await luckyNumber.getNumber(owner.address)).to.equal(7n);
    });

    it("should accept lower and upper boundary values (1 and 100)", async function () {
      await luckyNumber.connect(addr1).setNumber(1);
      expect(await luckyNumber.getNumber(addr1.address)).to.equal(1n);

      await luckyNumber.connect(addr2).setNumber(100);
      expect(await luckyNumber.getNumber(addr2.address)).to.equal(100n);
    });

    it("should allow a wallet to update its number", async function () {
      await luckyNumber.connect(owner).setNumber(12);
      expect(await luckyNumber.getNumber(owner.address)).to.equal(12n);

      await luckyNumber.connect(owner).setNumber(77);
      expect(await luckyNumber.getNumber(owner.address)).to.equal(77n);
    });

    it("should allow different wallets to save different numbers", async function () {
      await luckyNumber.connect(addr1).setNumber(23);
      await luckyNumber.connect(addr2).setNumber(88);

      expect(await luckyNumber.getNumber(addr1.address)).to.equal(23n);
      expect(await luckyNumber.getNumber(addr2.address)).to.equal(88n);
      expect(await luckyNumber.hasNumber(addr1.address)).to.equal(true);
      expect(await luckyNumber.hasNumber(addr2.address)).to.equal(true);
    });
  });

  describe("Validation & Reverts", function () {
    it("should reject zero (0)", async function () {
      await expect(luckyNumber.connect(owner).setNumber(0))
        .to.be.revertedWithCustomError(luckyNumber, "InvalidNumber")
        .withArgs(0);
    });

    it("should reject numbers greater than 100", async function () {
      await expect(luckyNumber.connect(owner).setNumber(101))
        .to.be.revertedWithCustomError(luckyNumber, "InvalidNumber")
        .withArgs(101);

      await expect(luckyNumber.connect(owner).setNumber(999))
        .to.be.revertedWithCustomError(luckyNumber, "InvalidNumber")
        .withArgs(999);
    });
  });

  describe("Unset Wallet Identification", function () {
    it("should correctly identify an unset wallet", async function () {
      expect(await luckyNumber.hasNumber(addr1.address)).to.equal(false);
      expect(await luckyNumber.getNumber(addr1.address)).to.equal(0n);
    });
  });

  describe("Events", function () {
    it("should emit NumberUpdated event when setting a number", async function () {
      await expect(luckyNumber.connect(addr1).setNumber(49))
        .to.emit(luckyNumber, "NumberUpdated")
        .withArgs(addr1.address, 49n);
    });

    it("should emit NumberUpdated event when updating a number", async function () {
      await luckyNumber.connect(addr1).setNumber(10);

      await expect(luckyNumber.connect(addr1).setNumber(99))
        .to.emit(luckyNumber, "NumberUpdated")
        .withArgs(addr1.address, 99n);
    });
  });
});
