import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import * as strings from 'SorpresaApplicationCustomizerStrings';
import styles from './AppCustomizer.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';

import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import 'animate.css';

const sp = spfi();
const LOG_SOURCE: string = 'SorpresaApplicationCustomizer';


export interface ISorpresaApplicationCustomizerProperties {
  Top: string;
  Bottom: string;
}


export default class SorpresaApplicationCustomizer
  extends BaseApplicationCustomizer<ISorpresaApplicationCustomizerProperties> {
  
    private _topPlaceholder : PlaceholderContent | undefined;
    private _bottomPlaceholder : PlaceholderContent | undefined;

  public onInit(): Promise<void> {

    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    return Promise.resolve();
  }
  private _renderPlaceHolders(): void {
    console.log("SorpresaApplicationCustomizer._renderPlaceHolders()");
    console.log(
      "Available placeholders: ",
      this.context.placeholderProvider.placeholderNames
        .map(name => PlaceholderName[name])
        .join(", ")
    );
  
    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );
  
      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }
  
      if (this.properties) {
        let topString: string = this.properties.Top;
        if (!topString) {
          topString = "(Top property was not defined.)";
        }
  
        if (this._topPlaceholder.domElement) {
          this._topPlaceholder.domElement.innerHTML = `
          <div class="${styles.app}">
            <div class="${styles.top}">
              <i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i> ${escape(
                topString
              )}
            </div>
          </div>`;
        }
      }
    }
  
    // Handling the bottom placeholder
    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );
  
      if (!this._bottomPlaceholder) {
        console.error("The expected placeholder (Bottom) was not found.");
        return;
      }
  
      if (this.properties) {
       // let bottomString: string = this.properties.Bottom || "(Bottom property was not defined.)";
        
        if (this._bottomPlaceholder.domElement) {
          this._bottomPlaceholder.domElement.innerHTML = `
            <div class="${styles.app}">
              <div class="${styles.bottom}">
                <img src="./assets/img/egg1.png" id="eggImage" class="animate__animated animate__tada" style="position: fixed; bottom: 20px; right: 20px; cursor: pointer;" alt="Gift" />
              </div>
            </div>`;
  
          // Add click event listener for the gift image
          const giftImage = this._bottomPlaceholder.domElement.querySelector("#giftImage");
          if (giftImage) {
            giftImage.addEventListener("click", () => this._handleGiftClick());
          }
        }
      }
    }
  }

  private _onDispose(): void {
    console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }

  private async _handleGiftClick(): Promise<void> {
    // Simulate gathering user information (this can be modified to gather actual user data)
    const userName = prompt("Congratulations! Please enter your name:");
    const userEmail = prompt("Please enter your email:");
    const pageUrl = window.location.href;
  
    // Check if all fields are filled
    if (userName && userEmail) {
      // Prepare the data for the "Sorpresa Winners List"
      const winnerData = {
        Name: userName,
        Email: userEmail,
        URL: pageUrl
      };
  
      // Call the method to save this data to the SharePoint list
      await this._saveWinnerData(winnerData);
      alert("Your information has been recorded. Thank you for participating!");
    } else {
      alert("Please fill in all fields.");
    }
  }
  
  private async _saveWinnerData(winnerData: { Name: string; Email: string; URL: string }): Promise<void> {
    try {
      await sp.web.lists.getByTitle("SorpresaWinners").items.add({
        Title: winnerData.Name,
        Email: winnerData.Email,
        URL: winnerData.URL
      });
      console.log("Winner data saved successfully!");
    } catch (error) {
      console.error("Error saving winner data: ", error);
    }
  }
  
  
}
