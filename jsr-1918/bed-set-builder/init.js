$(document).foundation();

var Parachute = {

  init: function() {

    var self = this;

    // bed set builder
    if($('.template-page-bed-set-builder').length) {
      self.bedsetbuilder.init();
    }

  },

  bedsetbuilder: {

    init: function() {
      var self = this;

      // Fitted Sheet
      var bsbFittedSheet = ['percale-fitted-sheet', 'sateen-fitted-sheet', 'linen-fitted-sheet'];
      self.buildProducts('fitted-sheet', bsbFittedSheet);

      // Top Sheet
      var bsbTopSheet = ['percale-top-sheet', 'sateen-top-sheet', 'linen-top-sheet'];
      self.buildProducts('top-sheet', bsbTopSheet);

      // Top Sheet
      var bsbDuvetCover = ['percale-duvet-cover', 'sateen-duvet-cover', 'linen-duvet-cover'];
      self.buildProducts('duvet-cover', bsbDuvetCover);

      // Top Sheet
      var bsbPillowcases = ['percale-pillowcases', 'sateen-pillowcases', 'linen-pillowcases'];
      self.buildProducts('pillowcases', bsbPillowcases);

      // ENABLE VARIANT SELECTIONS
      self.variantSelect();

      // TOGGLE FIRST VARIANT OF FIRST ITEM
      $('#bsb-product-variants .accordion').foundation('toggle', $('#fitted-sheet .accordion-content'));
      $('.product-select').prop('disabled', true);
      $('.tabs-panel.is-active .product-select').prop('disabled', false);  

      // SELECT / ADD ITEM TO SET
      $('.bsb-item-selected').change(function() {
        var addedProdContain = $(this).closest('.accordion-item'),
            addedProdContent = addedProdContain.find('.accordion-content'),
            addedProdHandle = $(addedProdContain).attr('id');

        self.productSelect(addedProdContain, addedProdContent, addedProdHandle, true);
      });

      // Clicking on Disabled Overlay activates/selects product
      $('body').on('click touchend', '.variant-disabled-overlay', function(event) { 
        var addedProdContain = $(this).closest('.accordion-item'),
            addedProdContent = addedProdContain.find('.accordion-content'),
            addedProdHandle = $(addedProdContain).attr('id'),
            checkbox = $(addedProdContain).find('.bsb-item-selected');

        checkbox.prop('checked', true); 
        self.productSelect(addedProdContain, addedProdContent, addedProdHandle, true);
      });

      // ADD SELECTED PRODUCTS TO CART
      $('body').on('click', '.add', function(e) {
        e.preventDefault();

        $('.product-select, .product-quantity').prop('disabled', true);
        $('.bsb-added .tabs-panel.is-active .product-select, .bsb-added .product-quantity ').prop('disabled', false);  

        var addItems = $(this).closest('form').serializeArray();
        console.log(addItems);

        $.ajax({
          type: 'POST',
          url: '/cart/add.js',
          data: addItems,
          dataType: 'json',
          success: function() {
            Parachute.cart.addToCartAlert(addItems);
          },
          error: function(XMLHttpRequest, textStatus) {
            //Shopify.onError(XMLHttpRequest, textStatus);
            var responseObj = JSON.parse(XMLHttpRequest.responseText);
            alert(responseObj.description);
            // make "add" clickable again, with fake delay
            $('#add').removeClass('disabled').animate({ top: 0 }, 500, function() {
              $(this).val('Add to Cart');
            });
          }
        });
      });
    },

    buildProducts: function(productType, productHandles) {
      var self = this;
      var groupID = '#' + productType

      // BUILD PRODUCTS LISTED IN productHandles ARRAY
      $(productHandles).each(function(index, item) {
        var prodHandle = item;
        self.loadVariants(groupID, prodHandle);
      });
    },

    loadVariants: function(groupID, prodHandle) {
      var whereToLoad = groupID + ' .accordion-content #' + prodHandle + ' .product-variant-container';

      $(whereToLoad).append('<div id="bsb-' + prodHandle + '" class="hidden-product-variants hide"><select class="product-select" name="id[]"><option value="">-</option></select></div><br />')

      $.ajax({ 
        type: 'GET', 
        url: '/products/' + prodHandle + '.js', 
        data: { get_param: 'value' }, 
        dataType: 'json',
        success: function (data) { 

          // ACTUAL VARIANT SELECTOR 
          $(data["variants"]).each(function (i, el) {
            var variantOption = '<option value="' + el.id + '" data-option-one="' + el.option1 + '" data-option-two="' + 
                                el.option2 + '" data-price="' + el.price + '">' + el.title + '</option>';

            $('#bsb-' + prodHandle + ' .product-select').append(variantOption); 
          });

          // VARIANT OPTIONS (FAKE SELECTORS)
          $(data["options"]).each(function (i, el) {
            var optionType = el.name, // e.g. Size
                optionTypeHandle = optionType.toLowerCase(); // e.g. size
            $(data["options"][i]["values"]).each(function (k, el) {
              var optionName = el, // e.g. Cal King
                  optionNameHandle = optionName.toLowerCase(); // e.g. cal-king

              // BUILD VARIANT HTML
              if(optionType == 'Size') { // SIZE VARIANT OPTIONS HTML
                var variantEle = '<div data-option-title="' + optionName + '" data-option-handle="' + optionNameHandle + 
                                 '" class="option cell ' + optionNameHandle + ' available small-4 position-relative">' + 
                                 '<div class="value size-box ' + optionNameHandle + '"><span class="size-box-inner">' + optionName + 
                                 '</span><span class="overlay"></span></div></div>'
              } else if(optionType == 'Color') { // COLOR VARIANT OPTIONS HTML
                var variantEle = '<div data-option-title="' + optionName + '" data-option-handle="' + optionNameHandle + 
                                 '" class="option cell ' + optionNameHandle + ' available small-2 large-2 position-relative">' + 
                                 '<div class="value color ' + optionNameHandle + ' material-sateen">' + optionName + 
                                 '<span class="overlay"></span></div>' + 
                                 '<span class="color-tooltip text-center medium-sanserif white-text show-for-large">' + 
                                 '<span class="color-value">' + optionName + '</span><span class="arrow-down"></span></span></div>'
              }
                  
              // PUT VARIANT OPTIONS INTO CONTAINER
              $('#' + prodHandle + ' .' + optionTypeHandle + '-variant .options').append(variantEle);
            });
          });

          // SELECT FIRST AVAILABLE VARIANT
          $('#' + prodHandle + ' .product-variants .options .option:first-child').addClass('selected');
          $('#' + prodHandle + ' .hidden-product-variants .product-select option:nth-child(2)').prop('selected', true);
          $('#' + prodHandle + ' .product-select, #' + prodHandle + ' .product-quantity').prop('disabled', true);
        }
      });
    },

    productSelect: function(addedProdContain, addedProdContent, addedProdHandle, addRemoveProd) {
      var self = this;

      var currentSelectedOption = addedProdContain.find('.tabs-panel.is-active .color-variant .option.selected')
          currentSelectedTitle = currentSelectedOption.data('option-title'),
          optionProduct = addedProdContain.find('.tabs-panel.is-active').attr('id'),
          productGroup = addedProdHandle,
          variantPrice = addedProdContain.find('.tabs-panel.is-active .hidden-product-variants select option:selected').attr('data-price');

      // TRUE adds/removes product from bundle, FALSE does not
      if (addRemoveProd == true) {
        $(addedProdContain).toggleClass('bsb-added');
        $(addedProdContain ).find('.bsb-item-price').toggleClass('hide');

        // ADD/REMOVE TRANSPARENCIES
        if (productGroup == 'top-sheet') {
          $('#bsb-transparency-' + productGroup).toggleClass('hide');
          $('#bsb-transparency-' + productGroup + '-2').toggleClass('hide');
        } else {
          $('#bsb-transparency-' + productGroup).toggleClass('hide');
        }     

        // Toggle Product Thumb
        $('#' + addedProdHandle + '-thumb').toggleClass('hide');

        // Toggle Enabled/Disabled QTY Selector 
        $(addedProdContain).find('.tabs-panel.is-active .product-select, .product-quantity').prop('disabled', function(i, v) { return !v; });     
      }

      if ($('.bsb-item-selected:checked').length > 0) {
        // AT LEAST 1 PRODUCT SELECTED
        $('#bsb-product-thumbnails').removeClass('hide');
        $('#bsb-your-set-is-empty').addClass('hide');
        $('#bsb-gallery').removeClass('hide');
        $('.add').removeClass('disabled');
        if(!addedProdContain.hasClass('is-active')) {
          $('.accordion').foundation('toggle', addedProdContent);
        }

        self.productPrice(currentSelectedOption, variantPrice, self);
        self.variantImageGallery(currentSelectedTitle, optionProduct, productGroup);
      } else {
        // NO PRODUCTS SELECTED
        $('.add').addClass('disabled');
        $('#bsb-product-thumbnails').addClass('hide');
        $('#bsb-your-set-is-empty').removeClass('hide');
        $('#bsb-gallery').addClass('hide');
      }
    },

    variantSelect: function() {
      var self = this;

      // Product Group Selectors
      $('.product-group').on('change.zf.tabs', function() {

        // Show Gallery of Product
        var addedProdContain = $(this).closest('.accordion-item'),
            addedProdContent = addedProdContain.find('.accordion-content'),
            addedProdHandle = $(addedProdContain).attr('id');

        self.productSelect(addedProdContain, addedProdContent, addedProdHandle, false);

        // DISABLE UNSELECTED VARIANTS
        $('.product-select').prop('disabled', true);
        $('.bsb-added .tabs-panel.is-active .product-select').prop('disabled', false);  
      });

      // Option Selectors
      $('body').on('click touchend', '.product-variants .options .value', function(e) {
        var optionIndex = $(this).parents('.options').attr('data-option-index');
        var optionValue = $(this).parents('.option').attr('data-option-title'); // what have I just clicked on?
        var selectedOption = $(this).parent().data('option-title');
        var optionProduct = $(this).closest('.tabs-panel').attr('id');
        var productGroup = $(this).closest('.accordion-item').attr('id');
        var variantOption = $(this);

        variantOption.closest('.product-variants').find('.dropdown-value').find('.value').text(selectedOption);
        //document.getElementById('product-select').value = id;

        // console.log(optionIndex,optionValue);
        //$('#low-inv-notice').hide();
        $(this).closest('.product-variants').find('.selected').removeClass('selected');
        $(this).parent('.option').addClass('selected');

        // console.log('START OF CLICK');
        if($(this).closest('.product-variant-container').find('.color-variant').length && $(this).closest('.product-variant-container').find('.size-variant').length) {
          var opt1 = $(this).closest('.product-variant-container').find('.size-variant .option.selected').data('option-title');
          var opt2 = $(this).closest('.product-variant-container').find('.color-variant .option.selected').data('option-title');
          // console.log(opt1);
          // console.log(opt2);
        } else if ($(this).closest('.product-variant-container').find('.color-variant').length && !$(this).closest('.product-variant-container').find('.size-variant').length) {
          var opt1 = $(this).closest('.product-variant-container').find('.color-variant .option.selected').data('option-title');
          var opt2 = '';
          // console.log(opt1);
        } else if ($(this).closest('.product-variant-container').find('.amount-variant').length) {
          var opt1 = $(this).closest('.product-variant-container').find('.amount-variant .option.selected').data('option-title');
          var opt2 = '';
          // console.log(opt1);
        }
        
        var hidden_opts = $(this).closest('.product-variant-container').find('.hidden-product-variants .product-select option');
        $(hidden_opts).each(function(i, obj) {
          var opt1_var = $(obj).data('option-one');
          var opt2_var = $(obj).data('option-two');
          var variantPrice = $(obj).attr('data-price');

          // console.log('---');
          // console.log(opt1_var);
          // console.log(opt2_var);

          if(opt2 != undefined || opt2 != '') {
            if(opt1 == opt1_var && opt2 == opt2_var) {
              // console.log('THIS IS THE ONE!');
              $(obj).prop('selected', true)
              self.productPrice($(this), variantPrice, self);
            }
          } else {
            if(opt1 == opt1_var) {
              // console.log('THIS IS THE ONE!');
              $(obj).prop('selected', true)
              self.productPrice($(this), variantPrice, self);
            }
          }
        });
        // console.log('END OF CLICK');

        // IF COLOR SELECTED
        if($(this).hasClass('color')) {
          //var variantOption = '.color-variant';
          //self.inventoryCheck($(this),variantOption);

          var variantOption = $(this).closest('.option'),
              variantIndex = variantOption.closest('.product-variants').find('.option').index(variantOption),
              variantOptionVal = variantOption.find('.value').text().replace(/\s+/g, '-').replace(/ |\//g,"-").toLowerCase();
          //console.log(variantIndex);
          if($(this).hasClass('new-color')) {
            variantOption.closest('.product-variants').find('.dropdown-value').find('.value').text(variantOption.data('option-title') + ' - New!');
          } else {
            variantOption.closest('.product-variants').find('.dropdown-value').find('.value').text(variantOption.data('option-title'));
          }
          if($(this).is(":not(.selected)")) {
            ///////////////
            // CHANGE COLOR IMAGES
            self.variantImageGallery(opt2, optionProduct, productGroup);
            ///////////////
          }
        }

        // IF SIZE SELECTED
        if($(this).hasClass('size-box')) {
          $('#error-size').hide();

          // CLASSIC BATH TOWEL SET
          if($(this).hasClass('towel-set')) {
            $(this).closest('.quick-view').find('.towel-note').show();
          } else {
            $(this).closest('.quick-view').find('.towel-note').hide();
          }
        }

        // IF DENSITY SELECTED
        if($(this).hasClass('density')) {
          $('#error-density').hide();
        }
      }); 
    },

    productPrice: function(selectedOption, variantPrice, self) {

      var productPrice = variantPrice.replace("00", "");
      selectedOption.closest('.accordion-item').find('.bsb-item-price').text(' - $' + productPrice).attr('data-price', variantPrice);

      self.bundlePrice();
    },

    bundlePrice: function() {
      var prices = [];
      var totalPrice = 0;

      $('.accordion-item').each(function () {
        if($(this).hasClass('bsb-added')) {
          var prodPrice = $(this).find('.bsb-item-price').attr('data-price');
          prices.push(prodPrice);
          totalPrice += parseInt(prodPrice, 10);

          console.log('Product:' + totalPrice)
        }
      });

      var formattedPrice = totalPrice.toString().replace("00", "");
      $('#bsb-total-price').html('$' + formattedPrice);

      console.log('Total:' + totalPrice)
    },

    variantImageGallery: function(optionName, optionProduct, productGroup) {
      var optColorHandle = optionName.replace(/\s+/g, '-').toLowerCase(),
          thumbContain = '#' + productGroup + '-thumb',
          material = optionProduct.replace('-' + productGroup, ''),
          galleryImage_1 = '{{ "null.jpg" | asset_url | split:"null.jpg" | first }}bsb-' + optionProduct + '-' + optColorHandle + '_850x.png',
          galleryImage_2 = '{{ "null.jpg" | asset_url | split:"null.jpg" | first }}bsb-' + optionProduct + '-' + optColorHandle + '-2_850x.png',
          thumbImage_1 = '{{ "null.jpg" | asset_url | split:"null.jpg" | first }}bsb-thumb-' + optionProduct + '-' + optColorHandle + '_160x.jpg';

      // UPDATE VARIANT THUMBS
      $(thumbContain + ' .product-thumb').attr("src",thumbImage_1);

      // UPDATE TRANSPARENCY
      if (productGroup == 'top-sheet') {
        $('#bsb-transparency-' + productGroup).attr("src",galleryImage_1);
        $('#bsb-transparency-' + productGroup + '-2').attr("src",galleryImage_2);
      } else {
        $('#bsb-transparency-' + productGroup).attr("src",galleryImage_1);
      }
    }
  },
}

// initialize site
$(function(){
    Parachute.init();
});