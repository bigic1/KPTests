import { test, expect } from '@playwright/test';

test('Login popup pri pokušaju dodavanja u adresar', async ({ page }) => {
  
  // Dolazak na stranicu nekog oglasa
  await page.goto(
    'https://www.kupujemprodajem.com/odeca-zenska/bluze/zenska-bluza/' + 
    'oglas/186569271?filterId=8267749033'
  );

  // Google popup - ako postoji, zatvoriti ga
  const googleFrame = page.frameLocator('iframe[src*="google.com"]')
  const closeBtn = googleFrame.locator('[id="close"]');
  const visible = await closeBtn.isVisible();
  if(visible) {
    await closeBtn.click();
  }
  
  //Pronalazak elementa koji ima tekst "Dodajte u adresar" i klik na njega
  await page.getByText('Dodajte u adresar').click();

  // Tekst "Nemate nalog na kp?" u popupu treba da bude vidljiv
  await expect(page.getByText('Nemate nalog na kp?')).toBeVisible();
});

test('Broj oglasa je veći od 1000', async ({ page }) => {

  // Za pribavljanje API odgovora
  const apiResponse = page.waitForResponse(response =>
    response.url().startsWith(
      'https://www.kupujemprodajem.com/api/web/v1/search/ad-count'
    ) &&
    response.status() === 200
  );

  // Dolazak na stranicu pretrage
  await page.goto(
    'https://www.kupujemprodajem.com/odeca-zenska/bluze/pretraga' +
    '?categoryId=743&groupId=1992&priceFrom=100&currency=rsd' +
    '&condition=new&condition=as-new&hasPrice=yes'
  );

  // Čekanje na API odgovor
  const response = await apiResponse;
  const json = await response.json();

  /*
    Rezultat u API odgovoru je tipa:
    {
      results: {
        searchCount: 1200
      }
    }
  */
  const searchCount: number | undefined = json?.results?.searchCount;

  console.log('Broj pronađenih oglasa:', searchCount);

  expect(searchCount).toBeGreaterThan(1000);
});
