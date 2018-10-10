App({
    onLaunch() {
        console.warn(`[ENVIROMENT mode="${__WEBPACK_MODE__}", target="${__WEBPACK_TARGET__}", platform="${__WEBPACK_PLATFORM__}"]`);
    }
});