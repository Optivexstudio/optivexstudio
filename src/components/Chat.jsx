import { useEffect } from 'react';

const Chat = ({ view }) => {
  useEffect(() => {
    // 1. სკრიპტის ჩატვირთვა (თუ უკვე არ არის)
    if (!window.Tawk_API) {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/675608d42480f5b4f5a7703e/1iefat45h'; // შენი პირადი ID
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    }

    // 2. ხილვადობის მართვა view-ს მიხედვით
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = function() {
      if (view === 'auth') {
        window.Tawk_API.hideWidget();
      } else {
        window.Tawk_API.showWidget();
      }
    };

    // თუ უკვე ჩატვირთულია, პირდაპირ ვმართავთ
    if (window.Tawk_API.hideWidget && window.Tawk_API.showWidget) {
      if (view === 'auth') window.Tawk_API.hideWidget();
      else window.Tawk_API.showWidget();
    }
  }, [view]);

  return null; // ეს კომპონენტი ვიზუალურად არაფერს აჩენს
};

export default Chat;