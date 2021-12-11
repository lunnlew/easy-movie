
import watchDir from "./service/watchDir"
import genNFO from "./service/genNFO"
    ;
(async () => {
    watchDir.initialize();
    genNFO.initialize();
})();