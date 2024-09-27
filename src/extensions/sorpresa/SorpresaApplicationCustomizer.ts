import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import * as strings from 'SorpresaApplicationCustomizerStrings';
import styles from './AppCustomizer.module.scss';

import { SPFI, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";

import 'animate.css';


const LOG_SOURCE: string = 'SorpresaApplicationCustomizer';
const sp = spfi();
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
                <div id="giftBox">
                <img src="${imgSrc}"  id="${styles.giftImage}" class="animate__animated animate__bounce animate__repeat-3"  alt="Surprise!" />
                </div>
                <div id="customAlert" class="${styles.customAlert}" style="display:none;">
                  <div class="${styles.alertContent}">
                    <p>Congratulations! You won a prize!</p>
                    <button id="okButton">OK</button>
                  </div>
                </div>
              </div>
            </div>`;



          const giftImage = this._bottomPlaceholder.domElement.querySelector("#giftBox");
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
    const customAlert = document.getElementById("customAlert") as HTMLElement;
    customAlert.style.display = "block";
    const user = await this._getCurrentUser();

    const okButton = document.getElementById("okButton");
    if (okButton) {
      okButton.onclick = async () => {
        customAlert.style.display = "none";
        const winnerData = {
          Name: user.Title,
          Email: user.Email,
          URL: window.location.href
        };
        console.log("WINNER DATA: " + JSON.stringify(winnerData, null, 2));

        await this._saveWinnerData(winnerData);
        alert("Your information has been recorded. Thank you for participating!");
      };
    }
  }

  private async _getCurrentUser(): Promise<any> {
    try {
      const user = await sp.web.currentUser();
      console.log("LOGGED IN USER: " + JSON.stringify(user, null, 2));
      return user;
    } catch (error) {
      console.error("Error getting current user: ", error);
      throw error;
    }
  }

  private async _saveWinnerData(winnerData: { Email: string; Name: string; URL: string }): Promise<void> {
    try {
      await sp.web.lists.getByTitle("SorpresaWinners").items.add({
        Email: winnerData.Email,
        Name: winnerData.Name,
        URL: winnerData.URL
      });

      console.log("Winner data saved successfully!");
    } catch (error) {
      console.error("Error saving winner data: ", error);
    }
  }
}



/*
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
*/