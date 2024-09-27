import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import * as strings from 'SorpresaApplicationCustomizerStrings';
import styles from './AppCustomizer.module.scss';

import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import 'animate.css';

const sp = spfi();
const LOG_SOURCE: string = 'SorpresaApplicationCustomizer';


export interface ISorpresaApplicationCustomizerProperties {
  Bottom: string;
}


export default class SorpresaApplicationCustomizer
  extends BaseApplicationCustomizer<ISorpresaApplicationCustomizerProperties> {

  private _bottomPlaceholder: PlaceholderContent | undefined;

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
        if (this._bottomPlaceholder.domElement) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const imgSrc = require('./assets/img/egg1.png');
          this._bottomPlaceholder.domElement.innerHTML = `
            <div class="${styles.app}">
              <div class="${styles.bottom}">
                <img src="${imgSrc}" id="${styles.giftImage}" class="animate__animated animate__bounce animate__repeat-3"  alt="Surprise!" />
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
