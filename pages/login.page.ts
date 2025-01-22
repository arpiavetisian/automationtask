import { Page,Locator } from '@playwright/test';
import {config} from '../config/config';

//This class stands for users's successful login process with credentials passwing from configuration file.
export class LoginPage {
  private page: Page;

  public signInButton = (): Locator => this.page.locator('text=Sign In').nth(0);
  public emailField = (): Locator => this.page.locator('input#email');
  public passwordField = (): Locator => this.page.locator('input#pass');
  public submitButton = (): Locator => this.page.locator('button#send2');

  constructor(page: Page, url: string) {
    this.page = page;
  }
  
  async login(): Promise<void> {
    await this.page.goto('/');
    await this.signInButton().click();
    await this.emailField().fill(config.email);
    await this.passwordField().fill(config.password);
    await this.submitButton().click();
  }
}