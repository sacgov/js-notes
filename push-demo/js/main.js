function checkFeasibility() {
    if (!('serviceWorker' in navigator)) {
        return `Service Worker isn't supported on this browser. Notifications will not work`;
    }
    if (!('PushManager' in window)) {
        return `Push isn't supported on this browser`;
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function registerServiceWorker() {
    const notFeasibleMessage = checkFeasibility();
    if (notFeasibleMessage) {
        return Promise.reject(new Error(notFeasibleMessage));
    }
    return navigator.serviceWorker.register('./js/service-worker.js').then(function (registration) {
        console.log('Service worker successfully registered.');
        return registration;
    }).catch(function (err) {
        console.error('Unable to register service worker.', err);
    });
}

function askPermission() {
    if (!(Notification && Notification.requestPermission)) {
        return Promise.reject(new Error('Could not Request Permission'));
    }
    return Notification.requestPermission().then(function (permissionResult) {
        if (permissionResult !== 'granted') {
            return Promise.reject(Error('We weren\'t granted permission.'));
        }
    });
}

function getNotificationPermissionState() {
    if (navigator.permissions) {
        return navigator.permissions.query({ name: 'notifications' }).then((result) => {
            return result.state;
        });
    }
    return Promise.resolve(Notification.permission)
}

function subscribeUserToPush(query) {
    return askPermission().then(registerServiceWorker).then(function (registration) {
        let title, options;
        switch (query) {
            case 'long':
                title = 'Simple Title wiht Longer Text';
                options = {
                    body: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum 
                        has been the industry's standard dummy text ever since the 1500s, when an unknown printer 
                        took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, 
                        but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised 
                        in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently 
                        with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
                };

                break;
            case 'image':
                title = 'Icon Notification';
                options = {
                    icon: '/images/notification-512x512.png'
                };
                break;
            case 'actions':
                 title = 'Actions Notification';
                 options = {
                    actions: [
                        {
                            action: 'apple-action',
                            title: 'Apple',
                            icon: '/images/fruits/apple.png'
                        },
                        {
                            action: 'grapes-action',
                            title: 'Grapes',
                            icon: '/images/fruits/grapes.png'
                        },
                        {
                            action: 'watermelon-action',
                            title: 'wWtermelon',
                            icon: '/images/fruits/watermelon.png'
                        },
                        {
                            action: 'bananas-action',
                            title: 'Bananas',
                            icon: '/images/fruits/bananas.png'
                        }
                    ]
                };

                const maxVisibleActions = Notification.maxActions;
                if (maxVisibleActions < 4) {
                    options.body = `This notification will only display ` +
                        `${maxVisibleActions} actions.`;
                } else {
                    options.body = `This notification can display up to ` +
                        `${maxVisibleActions} actions.`;
                }

                registration.showNotification(title, options);
                break;
            default:
                title = 'Simple Title';
                options = {
                    body: 'Simple piece of body text.\nSecond line of body text :)'
                };

            // code block
        }
        return registration.showNotification(title, options);
    }).catch((err) => {
        // console.log(Reveal.getCurrentSlide().getElementsByClassName('errorMessage')[0])
        Reveal.getCurrentSlide().getElementsByClassName('errorMessage')[0].innerHTML =
            `<i class="fas fa-exclamation-circle" style="color:#42affa;"></i>&nbsp&nbsp${err.message}`;
    });
}