import { test, expect } from '@playwright/test';

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

test("should show hotel search results",async({page})=>{
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going?").fill("Delhi");
    await page.getByRole("button",{name:"Search"}).click();

    await expect(page.getByText("Hotels found in Delhi")).toBeVisible();
    await expect(page.getByText("Skyline Getaways")).toBeVisible();
});

test("should show hotel detail",async({page})=>{
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going?").fill("Delhi");
    await page.getByRole("button",{name:"Search"}).click();

    await page.getByText("Skyline Getaways").click();
    await expect(page).toHaveURL(/detail/);
    await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();

});

test("should book hotel", async({page})=>{
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going?").fill("Delhi");

    const date=new Date();
    date.setDate(date.getDate()+3);
    const formattedDate=date.toISOString().split("T")[0];
    await page.getByPlaceholder("Check-Out Date").fill(formattedDate);

    await page.getByRole("button",{name:"Search"}).click();

    await page.getByText("Skyline Getaways").click();
    await page.getByRole("button", { name: "Book now" }).click();

    await expect(page.getByText("Confirm Your Details")).toBeVisible();
    
    const stripeFrame=page.frameLocator("iframe").first();
    await stripeFrame.locator('[placeholder="Card number"]').fill("4242424242424242");
    await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30");
    await stripeFrame.locator('[placeholder="ZIP]').fill("12345");

    await page.getByRole("button",{name:"Confirm Booking"}).click();
    await expect(page.getByText("Booking Saved!")).toBeVisible();

    await page.getByRole("link",{name:"My Bookings"}).click();

    await expect(page.getByText("Skyline Getaways")).toBeVisible();
    
});