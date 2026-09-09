import {
    completion, LLAMA_3_2_1B_INST_Q4_0, loadModel, unloadModel

} from "@qvac/sdk";



// Supports any Pear or HTTP URL

const modelId = await loadModel({

    modelSrc: LLAMA_3_2_1B_INST_Q4_0,

    modelType: "llm",

});



const history = [

    {

        role: "user",

        content: "QVAC, how may entropy be reversed?",

    },

];



const result = completion({

    modelId,

    history,

    stream: true,

});



for await (const token of result.tokenStream) {

    console.log(token);

}



await unloadModel({ modelId });