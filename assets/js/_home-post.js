/*!
  JS group for layout Home or Post
   v2.3

  ©
  MIT License
*/

{% include_relative _commons.js %}

{% include_relative _utils/timeago.js %}


{% if site.google_analytics.pv.enabled %}

  const proxyData = '{"url": "{{ site.google_analytics.pv.proxy_endpoint }}"}';

  {% include_relative _utils/pageviews.js %}

  {% include_relative lib/_countUp.min.js %}

{% endif %}
