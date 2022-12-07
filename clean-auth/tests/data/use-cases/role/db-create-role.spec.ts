import { describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";

import { getUserMock } from "@/tests/domain/mocks";
import { DbCreateRole } from "@/data/use-cases/role";
import { SaveRole } from "@/data/repos";
import { getUserPermissions, Permissions } from "@/domain/models";

class RoleRepoStub implements SaveRole {
  async save(input: SaveRole.Input): Promise<void> {}
}

const makeSut = () => {
  const roleRepoStub = new RoleRepoStub();
  const sut = new DbCreateRole(roleRepoStub);

  return { sut, roleRepoStub };
};

describe("DbCreateRole UseCase", () => {
  describe("Save", () => {
    let input: { name: string; permissions: Permissions[] };

    beforeAll(() => {
      input = { name: "user", permissions: getUserPermissions() };
    });

    it("should call RoleRepo with correct input", async () => {
      const { sut, roleRepoStub } = makeSut();
      const saveSpy = vi.spyOn(roleRepoStub, "save");

      await sut.execute(input);

      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith(input);
    });

    it("should rethrow if RoleRepo throws", async () => {
      const { sut, roleRepoStub } = makeSut();
      vi.spyOn(roleRepoStub, "save").mockRejectedValueOnce(
        new Error("save error")
      );

      const resultPromise = sut.execute(input);

      await expect(resultPromise).rejects.toThrow(new Error("save error"));
    });
  });
});
