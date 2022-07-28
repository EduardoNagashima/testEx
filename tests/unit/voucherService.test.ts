import { jest } from "@jest/globals";
import voucherRepository from "../../src/repositories/voucherRepository.js";
import voucherService from "../../src/services/voucherService";
import { conflictError } from "../../src/utils/errorUtils.js";
"../../src/services/voucherService.js";

describe("voucher test", () => {
  it("create voucher", async () => {
    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => { return null });

    jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce((): any => { return { code: "teste321", discount: 15 } });

    const result = await voucherService.createVoucher('teste123', 10);

    expect(result).toEqual(undefined);
  });

  it("create voucher DENIED", async () => {
    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => { return { code: "something", discount: 10 } });

    jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce((): any => { return { code: "teste321", discount: 15 } });

    const result = await voucherService.createVoucher('teste123', 10);

    expect(result).toEqual(conflictError("Voucher does not exist."));
  });

  it("Apply voucher", async () => {
    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => { return { code: "teste123", discount: '20', used: false } });

    jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce((): any => { return {} })

    const result = await voucherService.applyVoucher("teste123", 200);
    console.log(result)
    expect(result).toEqual({ "amount": 200, "applied": true, "discount": "20", "finalAmount": 160 });
  });

  it("Apply voucher DENIED", async () => {
    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => { return { code: "teste123", discount: '20', used: false } });

    jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce((): any => { return {} })

    const result = await voucherService.applyVoucher("teste123", 10);
    console.log(result)
    expect(result).toEqual({ "amount": 10, "applied": false, "discount": "20", "finalAmount": 10 });
  });

})