import { Transformer } from "@parcel/plugin";
import { ModuleKind, ModuleResolutionKind, ScriptTarget } from "typescript"

import * as tts from "ttypescript";
import SourceMap from "@parcel/source-map";

export default new Transformer({
    async transform({ asset }) {
        // Retrieve the asset's source code and source map.
        let source = await asset.getCode();
        let sourceMap = await asset.getMap();

        // Run it through some compiler, and set the results 
        // on the asset.
        let { code, map } = compile(source, sourceMap);
        console.log(code);

        asset.setCode(code);
        asset.setMap(map);

        // Return the asset
        return [asset];
    }
})

function compile(source: string, map: SourceMap | null | undefined) {

    const output = tts.transpileModule(source, {
        compilerOptions: {
            module: ModuleKind.ESNext,
            target: ScriptTarget.ESNext,
            moduleResolution: ModuleResolutionKind.NodeJs,
        }
    })

    // TODO: parse output source map
    return { code: output.outputText, map };
    
}