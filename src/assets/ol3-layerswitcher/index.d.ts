
declare module ol {

  module control {

    class LayerSwitcher extends ol.control.Control {
      constructor(opt_options?: olx.control.ControlOptions);
    }
  }
}


declare module olx {

  module control {

    interface ControlOptions {
      tipLabel?: string;
    }
  }
}
