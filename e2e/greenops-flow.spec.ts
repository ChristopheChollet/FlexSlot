import { test, expect } from "@playwright/test";

/**
 * Flow métier complet, déterministe (services externes mockés par le stub) :
 * FlexSlot lit une recommandation issue de GridPulse, puis crée le slot dans GreenOps.
 */
test.describe("FlexSlot · reco → création de slot GreenOps (mocké)", () => {
  test("affiche la recommandation puis crée le slot dans GreenOps", async ({
    page,
  }) => {
    await page.goto("/recommendations");

    // La reco principale (score 82 → « Consommer ») s'affiche.
    await expect(
      page.getByRole("heading", { name: "Consommer" }),
    ).toBeVisible();

    // Le slot suggéré est un « besoin (need) » → bouton actif.
    const createButton = page.getByRole("button", {
      name: "Créer le slot dans GreenOps",
    });
    await expect(createButton).toBeEnabled();

    await createButton.click();

    // État de succès renvoyé par la server action (via le stub GreenOps).
    await expect(page.getByText("Slot créé")).toBeVisible();
    await expect(page.getByText(/id\s+slot_e2e_0001/)).toBeVisible();
    await expect(page.getByText(/source\s+flexslot/)).toBeVisible();

    const slotLink = page.getByRole("link", {
      name: /Voir ce slot dans GreenOps/,
    });
    await expect(slotLink).toBeVisible();
    await expect(slotLink).toHaveAttribute("href", /slot-slot_e2e_0001/);
  });
});
