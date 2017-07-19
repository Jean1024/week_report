/******设置根元素字体大小*******/
  !function(win,doc){
      var d=doc.documentElement;
      function change(){
          var fz = d.clientWidth/25
          // fz = fz>20?20:fz;
          d.style.fontSize= fz+'px';
      }
      win.addEventListener('resize',change,false);
      change();
  }(window,document);
