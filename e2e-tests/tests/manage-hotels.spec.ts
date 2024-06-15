import { test, expect } from '@playwright/test';
import path from 'path';

const UI_URL="http://localhost:5173/"

test.beforeEach(async({page})=>{
    await page.goto(UI_URL);
  
    //get sign in button
    await page.getByRole("link",{name:"Sign in"}).click();

    await expect(page.getByRole("heading",{name: "Sign In"})).toBeVisible();

    await page.locator("[name=email]").fill("user10@hail.com");

    await page.locator("[name=password]").fill("password@123");

    await page.getByRole("button",{name:"Login"}).click();

    await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

test("should allow user to add a hotel",async({page})=>{
    await page.goto(`${UI_URL}add-hotel`)

    await page.locator('[name="name"]').fill("Test Hotel 1");
    await page.locator("[name=city]").fill("Test City 1");
    await page.locator("[name=country]").fill("Test Country 1");
    await page.locator("[name=description]").fill("This is a test description for a test hotel 1");
    await page.locator("[name=pricePerNight]").fill("2450");
    await page.selectOption('select[name=starRating]',"3");
   
    await page.getByText("Budget").click();
   
    await page.getByLabel("Free Wifi").check();
    await page.getByLabel("Parking").check();
   
    await page.locator("[name=adultCount]").fill("2");
    await page.locator("[name=childCount]").fill("3");

    await page.setInputFiles("[name=imageFiles]",[
        path.join(__dirname,"files","taj.jpeg"),
        path.join(__dirname,"files","tajinside.jpeg"),
    ]);

    await page.getByRole("button",{name:"Save"}).click();

    await expect(page.getByText("Hotel Saved")).toBeVisible();

});

test("should display hotels",async({page})=>{
    await page.goto(`${UI_URL}my-hotels`);

    await expect(page.getByText("Skyline Hotel")).toBeVisible();
    await expect(page.getByText("Phasellus eu lacus ut augue")).toBeVisible();
    await expect(page.getByText("Delhi, India")).toBeVisible();
    await expect(page.getByText("Ski Resort")).toBeVisible();
    await expect(page.getByText("Rs.5000/night")).toBeVisible();
    await expect(page.getByText("2 adults, 1 children")).toBeVisible();
    await expect(page.getByText("4 Star Rating")).toBeVisible();

    await expect(page.getByRole("link",{name:"View Details"})).toBeVisible();
    await expect(page.getByRole("link",{name:"Add Hotel"})).toBeVisible();
    
})