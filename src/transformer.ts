import { Transformer } from "@parcel/plugin";
import { JsxEmit, ModuleKind, ModuleResolutionKind, ScriptTarget, TranspileOptions } from "typescript";

import * as tts from "ttypescript";
import SourceMap from "@parcel/source-map";
import { MutableAsset } from "@parcel/types";

let tsconfig: {[key: string]: any} = {};
export default new Transformer({

    async loadConfig({ config }) {

        const config_file = await config.getConfig([
            'parcel-tts.json',
        ], {});

        let contents = config_file ?? {};
        if(Object.keys(contents).length) {
            console.log('Using config file:', config_file?.filePath);
            tsconfig = contents;
        }

    },

    async transform({ asset }) {

        // Retrieve the asset's source code and source map.
        let source = await asset.getCode();
        let sourceMap = await asset.getMap();

        // Run it through some compiler, and set the results 
        // on the asset.
        let { code, map } = compile(source, sourceMap, asset);

        asset.setCode(code);
        asset.setMap(map);

        // Return the asset
        return [asset];
    }
})

function compile(source: string, map: SourceMap | null | undefined, asset: MutableAsset) {

    const config: TranspileOptions = {
        ...tsconfig,
        compilerOptions: {
            module: ModuleKind.ESNext,
            target: ScriptTarget.ESNext,
            moduleResolution: ModuleResolutionKind.NodeJs,
            jsx: JsxEmit.React,
            plugins: [],
            ...(tsconfig.compilerOptions ?? {})
        },
    };

    const output = tts.transpileModule(source, config);

    // TODO: parse output source map
    return { code: output.outputText, map };

}