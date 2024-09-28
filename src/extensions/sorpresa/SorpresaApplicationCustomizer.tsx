import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import * as strings from 'SorpresaApplicationCustomizerStrings';
import styles from './AppCustomizer.module.scss';

import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";

import 'animate.css';


const LOG_SOURCE: string = 'SorpresaApplicationCustomizer';
export interface ISorpresaApplicationCustomizerProperties {
  Bottom: string;
}

export default class SorpresaApplicationCustomizer
  extends BaseApplicationCustomizer<ISorpresaApplicationCustomizerProperties> {
  private sp: ReturnType<typeof spfi>;
  private _bottomPlaceholder: PlaceholderContent | undefined;

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    this.sp = spfi().using(SPFx(this.context));
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
                <div class="${styles.giftBox}" id="giftBox">
                <img src="${imgSrc}"  id="${styles.giftImage}" class="animate__animated animate__bounce animate__repeat-3"  alt="Surprise!" />
                </div>
              </div>

              <div id="customAlert" class="${styles.customAlert}" style="display:none;">
                <div class="${styles.alertContent}">
                    <p>Congratulations! You won a prize!</p>
                    <button id="okButton">OK</button>
                </div>
              </div>
            </div>
            `;

          const giftImage = this._bottomPlaceholder.domElement.querySelector("#giftBox");
          if (giftImage) {
            giftImage.addEventListener("click", () => this._handleGiftClick());
          }
        }
      }
    }
  }

  private _onDispose(): void {
    console.log('[SorpresaApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }

  private async _handleGiftClick(): Promise<void> {
    const user = await this.sp.web.currentUser();
    console.log("LOGGED IN USER: " + JSON.stringify(user, null, 2));

    const customAlert = document.getElementById("customAlert") as HTMLElement;
    customAlert.style.display = "block";
    const giftBox = document.getElementById("giftBox") as HTMLElement;
    giftBox.style.display = "none";

    const okButton = document.getElementById("okButton");
    if (okButton) {
      okButton.onclick = async () => {
        customAlert.style.display = "none";
        const items = await this.sp.web.lists.getByTitle("SorpresaWinners").items();
        console.log("LIST: " + JSON.stringify(items, null, 2));

        const currentURL = "https://tecconsultat.sharepoint.com/sites/Myla/SiteCustomiser/SitePages/Home.aspx";
        //const currentURL = window.location.href;

        const item = await this.sp.web.lists.getByTitle("SorpresaWinners").items.add({
          Title: user.Title,
          Name: user.Title,
          Email: user.Email,
          Website: currentURL.toString()
        });

        console.log("WINNER DATA Listed: " + JSON.stringify(item, null, 2));
      };
    }
  }
}


