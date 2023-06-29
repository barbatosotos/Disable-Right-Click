
    var setTheme = function (prop, value) {
        document.documentElement.style.setProperty(prop, value);
    };
    setTheme('--fontFamily', 'kingthings');
    var tipCounter = 0;
    var audioAlert = new Audio('https://cdn.trakteer.id/audio/alert.mp3');
    var delayDuration = 1000;
    var showDuration = 7000;
    window.notifier = new AWN({
        position: "bottom-right",
        maxNotifications: 1,
        durations: {
            global: showDuration
        },
        icons: {
            prefix: "<span class='icon icon-lg icon-",
            suffix: "'></span>",
            info: "info-large bg-secondary",
            success: "tick bg-success",
            warning: "warning bg-warning",
            alert: "warning",
            async: "cog-outline",
            confirm: "warning"
        }
    });
    var tipsQueue = [];
    var isAnimating = false;

    function escapeHtml(text) {
        return text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    };

    function getAudioAlertDuration() {
        return audioAlert.duration * 1000;
    }

    function playAudioAlert() {
        audioAlert.play();
        if (getAudioAlertDuration() > showDuration) {
            setTimeout(function () {
                audioAlert.pause();
                audioAlert.currentTime = 0;
            }, showDuration);
        }
    }

    function spawnNotifier(data) {
        var messageBody = 'Baru saja mentraktir <span class="text-primary">' + data['quantity'] + ' ' + escapeHtml(
            data['unit']) + '</span> senilai <span class="text-primary">' + data['price'] + '</span>';
        window.notifier.tip(messageBody, {
            labels: {
                tip: '<img src="' + data['supporter_avatar'] +
                    '" width="30px" style="min-width: 30px; margin-right: 10px; border-radius: 9999px" /> ' +
                    escapeHtml(data['supporter_name'])
            },
            icons: {
                prefix: "<img width='50px' src='" + data['unit_icon'] + "'",
                suffix: "/>"
            }
        });
        playAudioAlert();
        tipCounter++;
        setTimeout(function () {
            isAnimating = false;
            if (tipsQueue[0]) {
                isAnimating = true;
                showNotification();
            }
        }, showDuration + delayDuration);
    };

    function showNotification() {
        spawnNotifier(tipsQueue[0]);
        tipsQueue.splice(0, 1);
    }; /****************/ /* PREVIEW MODE */ /****************/ /***********/ /* Init JS */ /***********/
    var hasInitialized = false;
    var init = function () {
        hasInitialized = true;
        window.Echo.channel('creator-stream.n8rx3lmdanb4wamg.trstream-6UmylkHXrNEuBZmaQD3Q').notification(
            function (data) {
                if (data.type === 'new-tip-success' || data.type === 'new-tip-replay') {
                    tipsQueue.push(data);
                    if (!isAnimating) {
                        isAnimating = true;
                        showNotification();
                    }
                }
            });
        window.Echo.channel('creator-stream-test.n8rx3lmdanb4wamg.trstream-6UmylkHXrNEuBZmaQD3Q').notification(
            function (data) {
                if (data.type === 'new-tip-simulation') {
                    tipsQueue.push(data);
                    if (!isAnimating) {
                        isAnimating = true;
                        showNotification();
                    }
                }
            });
    };
    audioAlert.addEventListener("loadedmetadata", function () {
        if (!hasInitialized) {
            init();
        }
    });
    audioAlert.addEventListener("error", function () {
        if (!hasInitialized) {
            init();
        }
    });
