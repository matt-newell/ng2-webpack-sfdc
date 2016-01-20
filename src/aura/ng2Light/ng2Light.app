<aura:application >
  <ltng:require scripts="/resource/ng2/vendor.bundle.js, /resource/ng2/bundle.js" afterScriptsLoaded="{!c.initBoot}"/>
  <script src="vendor.bundle.js"></script>
  <script src="bundle.js"></script>
  <body>
    <div class="container">
      <div data-ng-store="data-ng-store"></div>
    </div>
  </body>
</aura:application>
