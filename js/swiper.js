; (function () {

    function Swiper(options, wrapper) {
        this.width = options.width || 500;
        this.height = options.height || 400;
        this.type = options.type || 'animation';
        this.isAuto = options.isAuto || true;
        this.arrowStatus = options.arrowStatus || 'hover';
        this.isShowCircle = options.isShowCircle || true;
        this.content = options.content;
        this.times = options.times || 3000;
        this.circlePosition = options.circlePostion || 'left';

        /* 代表的是轮播图片的个数 */
        this.len = this.content.length;
        /* 页面中的容器 */
        this.wrapper = wrapper;
        /* 当前页 */
        this.current = 0;
        /* 加锁 */
        this.playing = false;
        /* 自动轮播计时器 */
        this.timer = null;
    }

    /* 轮播图初始化 */
    Swiper.prototype.init = function () {
        /* 结构 */
        this.createtHtml();
        /* 样式 */
        this.initStyle();
        /* 事件 */
        this.bindEvent();
        if (this.isAuto) {
            this.autoChange();
        }
    }

    Swiper.prototype.createtHtml = function () {
        /* 外层结构 */
        const swiperWrapper = $('<div class="cj-swiper-wrapper"></div>');
        const swiperContent = $('<ul class="cj-swiper-content"></ul>');
        const swiperSpots = $('<div class="cj-swiper-spots"></div>');
        for (let i = 0; i < this.len; i++) {
            $('<li class="cj-swiper-item"></li>')
                .html(this.content[i])
                .appendTo(swiperContent);
            $('<span></span>').appendTo(swiperSpots);
        }
        /* 为了实现无缝滚动 */
        if (this.type === 'animation') {
            $('<li class="cj-swiper-item"></li>')
                .html($(this.content[0]).clone())
                .appendTo(swiperContent);
        }

        const swiperLeftArrow = $('<div class="cj-swiper-btn cj-swiper-lbtn">&#xe628;</div>');
        const swiperRightArrow = $('<div class="cj-swiper-btn cj-swiper-rbtn">&#xe625;</div>');
        /* 最后给我们的元素添加了类名，是为了区别不同的类型设置不同的样式 */
        const swiperFlat = swiperWrapper.append(swiperContent).append(swiperLeftArrow).append(swiperRightArrow).append(swiperSpots).addClass('cj-swiper-' + this.type);
        this.wrapper.append(swiperFlat);
    }

    Swiper.prototype.initStyle = function () {
        /* 设置css样式的时候会全局找，添加上第二个参数 作用域 */
        $('.cj-swiper-wrapper', this.wrapper).css({
            width: this.width,
            height: this.height,
        }).find('.cj-swiper-content').css({
            width: this.type === 'animation' ? (this.len + 1) * this.width : this.width,
            height: this.height,
        }).find('.cj-swiper-item').css({
            width: this.width,
            height: this.height,
        });
        /* 给对应的小圆点添加默认颜色 */
        $('.cj-swiper-wrapper').find('.cj-swiper-spots > span').eq(this.current).addClass('cj-swiper-current');
        /* 判断小圆点是否展示 */
        if (this.isShowCircle) {
            switch (this.circlePosition) {
                case 'center':
                    $('.cj-swiper-wrapper').find('.cj-swiper-spots').css('text-align', 'center');
                    break;
                case 'right':
                    $('.cj-swiper-wrapper').find('.cj-swiper-spots').css('text-align', 'right');
                    break;
            }
        } else {
            $('.cj-swiper-wrapper').find('.cj-swiper-spots > span').hide();
        }

        /* 判断箭头的状态 */
        switch (this.arrowStatus) {
            case 'hide':
                $('.cj-swiper-wrapper').find('.cj-swiper-btn').hide();
                break;
            case 'hover':
                $('.cj-swiper-wrapper').hover(function () {
                    $(this).find('.cj-swiper-btn').fadeIn();
                }, function () {
                    $(this).find('.cj-swiper-btn').fadeOut();
                }).find('.cj-swiper-btn').hide();
                break;
            default:
                break;
        }
    }

    Swiper.prototype.bindEvent = function () {
        /* 点击切换 */
        const self = this;
        $('.cj-swiper-wrapper').mouseenter(function() {
            clearInterval(self.timer);
        }).mouseleave(function() {
            self.autoChange();
        }).find('.cj-swiper-lbtn').click(function () {
            if (self.playing) {
                return false;
            } 
            self.playing = true;
            if (self.current === 0) {
                if (self.type === 'animation') {
                    $('.cj-swiper-wrapper').find('.cj-swiper-content').css({
                        left: -self.len * self.width,
                    });
                }
                self.current = self.len - 1;
            } else {
                self.current--;
            }
            self.change();
        }).end().find('.cj-swiper-rbtn').click(function () {
            if (self.playing) {
                return false;
            } 
            self.playing = true;
            if (self.type === 'animation') {
                if (self.current === self.len) {
                    $('.cj-swiper-wrapper').find('.cj-swiper-content').css({
                        left: 0,
                    });
                    self.current = 1;
                } else {
                    self.current++;
                }
            } else if (self.type === 'fade') {
                if (self.current === self.len - 1) {
                    self.current = 0;
                } else {
                    self.current++;
                }
            }
            self.change();
        }).end().find('.cj-swiper-spots > span').click(function () {
            if (self.playing) {
                return false;
            } 
            self.playing = true;
            let index = $(this).index();
            self.current = index;
            self.change();
        })
    }

    Swiper.prototype.change = function () {
        const self = this;
        /* 切换的动画效果 */
        if (this.type === 'fade') {
            $('.cj-swiper-wrapper').find('.cj-swiper-content').find('.cj-swiper-item').eq(this.current).fadeIn(function () {
                self.playing = false;
            }).siblings().fadeOut(function () {
                self.playing = false;
            });
        } else if (this.type === 'animation') {
            $('.cj-swiper-wrapper').find('.cj-swiper-content').animate({
                left: -this.current * this.width,
            }, function () {
                self.playing = false;
            })
        }
        $('.cj-swiper-wrapper').find('.cj-swiper-spots > span').eq(this.current % this.len).addClass('cj-swiper-current').siblings().removeClass('cj-swiper-current');
    }

    Swiper.prototype.autoChange = function() {
        this.timer = setInterval(() => {
            $('.cj-swiper-wrapper').find('.cj-swiper-rbtn').click()
        }, this.times);
    }

    $.fn.extend({
        swiper(options) {
            /* 此this指向的是调用该方法的页面中的容器 */
            const obj = new Swiper(options, this);
            obj.init();
        },
    });
})()