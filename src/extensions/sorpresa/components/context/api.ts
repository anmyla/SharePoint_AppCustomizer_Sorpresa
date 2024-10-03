import { spfi, SPFx as spSPFx, SPFI } from "@pnp/sp";
import { graphfi, SPFx as graphSPFx, GraphFI } from "@pnp/graph";
import "@pnp/sp/files";
import "@pnp/sp/webs";
import "@pnp/graph";
import "@pnp/graph/users";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";

let _sp: SPFI | undefined = undefined;
export const sp = () => {
  if (!_sp) {
    throw new Error("sp not initialized");
  }
  return _sp;
};
let _graph: GraphFI | undefined = undefined;
export const graph = () => {
  if (!_graph) {
    throw new Error("graph not initialized");
  }
  return _graph;
};

export const init = async (context: ApplicationCustomizerContext) => {
  _sp = spfi("https://tecconsultat.sharepoint.com/sites/Myla").using(
    spSPFx(context)
  );
  _graph = graphfi().using(graphSPFx(context));
};
