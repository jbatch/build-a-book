/*https://github.com/sole/Animated_GIF*/
/** Library used for creating gif from frame data */
/* eslint-disable */
!(function e(t, n, r) {
  function i(a, l) {
    if (!n[a]) {
      if (!t[a]) {
        var f = 'function' == typeof require && require;
        if (!l && f) return f(a, !0);
        if (o) return o(a, !0);
        throw new Error("Cannot find module '" + a + "'");
      }
      var s = (n[a] = { exports: {} });
      t[a][0].call(
        s.exports,
        function (e) {
          var n = t[a][1][e];
          return i(n ? n : e);
        },
        s,
        s.exports,
        e,
        t,
        n,
        r
      );
    }
    return n[a].exports;
  }
  for (var o = 'function' == typeof require && require, a = 0; a < r.length; a++) i(r[a]);
  return i;
})(
  {
    1: [
      function (e, t) {
        function n(t) {
          'use strict';
          function n() {
            if (0 === G.length) throw 'No workers left!';
            return G.pop();
          }
          function r(e) {
            G.push(e);
          }
          function i(e) {
            k.length;
            F = e;
            for (var t = 0; h > t && t < k.length; t++) o(t);
          }
          function o(e) {
            var t, i;
            return (
              (t = k[e]),
              t.beingProcessed || t.done
                ? (console.error('Frame already being processed or done!', t.position), void l())
                : ((t.sampleInterval = u),
                  (t.beingProcessed = !0),
                  (i = n()),
                  (i.onmessage = function (e) {
                    var n = e.data;
                    delete t.data,
                      (t.pixels = Array.prototype.slice.call(n.pixels)),
                      (t.palette = Array.prototype.slice.call(n.palette)),
                      (t.done = !0),
                      (t.beingProcessed = !1),
                      r(i),
                      l();
                  }),
                  void i.postMessage(t))
            );
          }
          function a() {
            for (var e = -1, t = 0; t < k.length; t++) {
              var n = k[t];
              if (!n.done && !n.beingProcessed) {
                e = t;
                break;
              }
            }
            e >= 0 && o(e);
          }
          function l() {
            var e = k.every(function (e) {
              return !e.beingProcessed && e.done;
            });
            I++, A((0.75 * I) / k.length), e ? P || f(k, F) : setTimeout(a, 1);
          }
          function f(e, t) {
            var n,
              r = [],
              i = { loop: y };
            null !== p && null !== w && ((n = w), (i.palette = n));
            var o = new c(r, v, g, i);
            (P = !0),
              e.forEach(function (t) {
                var r;
                n || (r = t.palette),
                  A(0.75 + (0.25 * t.position * 1) / e.length),
                  o.addFrame(0, 0, v, g, t.pixels, { palette: r, delay: x });
              }),
              o.end(),
              A(1),
              (e = []),
              (P = !1),
              t(r);
          }
          function s(e) {
            return 0 !== e && 0 === (e & (e - 1));
          }
          var u,
            h,
            d,
            c = e('./lib/omggif').GifWriter,
            v = t.width || 160,
            g = t.height || 120,
            p = t.dithering || null,
            w = t.palette || null,
            m = null,
            b = null,
            y = 0,
            x = 250,
            k = [],
            I = 0,
            F = function () {},
            A = function () {},
            _ = [],
            G = [],
            P = !1;
          if (w) {
            if (!(w instanceof Array)) throw w;
            if (w.length < 2 || w.length > 256) {
              for (console.error('Palette must hold only between 2 and 256 colours'); w.length < 2; ) w.push(0);
              w.length > 256 && (w = w.slice(0, 256));
            }
            if (!s(w.length))
              for (console.error('Palette must have a power of two number of colours'); !s(w.length); )
                w.splice(w.length - 1, 1);
          }
          (t = t || {}),
            (u = t.sampleInterval || 10),
            (h = t.numWorkers || 2),
            (d = t.workerPath || 'Animated_GIF.worker.js');
          for (var B = 0; h > B; B++) {
            var W = new Worker(d);
            _.push(W), G.push(W);
          }
          var R = (function () {
            for (var e = [], t = 0; 256 > t; t++) e[t] = String.fromCharCode(t);
            return function (t) {
              for (var n = t.length, r = '', i = 0; n > i; i++) r += e[t[i]];
              return r;
            };
          })();
          (this.setSize = function (e, t) {
            (v = e),
              (g = t),
              (m = document.createElement('canvas')),
              (m.width = e),
              (m.height = t),
              (b = m.getContext('2d'));
          }),
            (this.setDelay = function (e) {
              x = 0.1 * e;
            }),
            (this.setRepeat = function (e) {
              y = e;
            }),
            (this.addFrame = function (e) {
              null === b && this.setSize(v, g), b.drawImage(e, 0, 0, v, g);
              var t = b.getImageData(0, 0, v, g);
              this.addFrameImageData(t);
            }),
            (this.addFrameImageData = function (e) {
              var t = (e.length, new Uint8Array(e.data));
              k.push({
                data: t,
                width: e.width,
                height: e.height,
                palette: w,
                dithering: p,
                done: !1,
                beingProcessed: !1,
                position: k.length,
              });
            }),
            (this.onRenderProgress = function (e) {
              A = e;
            }),
            (this.isRendering = function () {
              return P;
            }),
            (this.getBase64GIF = function (e) {
              var t = function (t) {
                var n = R(t),
                  r = 'data:image/gif;base64,' + btoa(n);
                e(r);
              };
              i(t);
            }),
            (this.getBlobGIF = function (e) {
              var t = function (t) {
                var n = new Uint8Array(t),
                  r = new Blob([n], { type: 'image/gif' });
                e(r);
              };
              i(t);
            }),
            (this.destroy = function () {
              _.forEach(function (e) {
                e.terminate();
              });
            });
        }
        t.exports = n;
      },
      { './lib/omggif': 2 },
    ],
    2: [
      function (e, t, n) {
        function r(e, t, n, r) {
          function o(e) {
            var t = e.length;
            if (2 > t || t > 256 || t & (t - 1)) throw 'Invalid code/color length, must be power of 2 and 2 .. 256.';
            return t;
          }
          var a = 0,
            r = void 0 === r ? {} : r,
            l = void 0 === r.loop ? null : r.loop,
            f = void 0 === r.palette ? null : r.palette;
          if (0 >= t || 0 >= n || t > 65535 || n > 65535) throw 'Width/Height invalid.';
          (e[a++] = 71), (e[a++] = 73), (e[a++] = 70), (e[a++] = 56), (e[a++] = 57), (e[a++] = 97);
          var s = 0,
            u = 0;
          if (null !== f) {
            for (var h = o(f); (h >>= 1); ) ++s;
            if (((h = 1 << s), --s, void 0 !== r.background)) {
              if (((u = r.background), u >= h)) throw 'Background index out of range.';
              if (0 === u) throw 'Background index explicitly passed as 0.';
            }
          }
          if (
            ((e[a++] = 255 & t),
            (e[a++] = (t >> 8) & 255),
            (e[a++] = 255 & n),
            (e[a++] = (n >> 8) & 255),
            (e[a++] = (null !== f ? 128 : 0) | s),
            (e[a++] = u),
            (e[a++] = 0),
            null !== f)
          )
            for (var d = 0, c = f.length; c > d; ++d) {
              var v = f[d];
              (e[a++] = (v >> 16) & 255), (e[a++] = (v >> 8) & 255), (e[a++] = 255 & v);
            }
          if (null !== l) {
            if (0 > l || l > 65535) throw 'Loop count invalid.';
            (e[a++] = 33),
              (e[a++] = 255),
              (e[a++] = 11),
              (e[a++] = 78),
              (e[a++] = 69),
              (e[a++] = 84),
              (e[a++] = 83),
              (e[a++] = 67),
              (e[a++] = 65),
              (e[a++] = 80),
              (e[a++] = 69),
              (e[a++] = 50),
              (e[a++] = 46),
              (e[a++] = 48),
              (e[a++] = 3),
              (e[a++] = 1),
              (e[a++] = 255 & l),
              (e[a++] = (l >> 8) & 255),
              (e[a++] = 0);
          }
          var g = !1;
          (this.addFrame = function (t, n, r, l, s, u) {
            if ((g === !0 && (--a, (g = !1)), (u = void 0 === u ? {} : u), 0 > t || 0 > n || t > 65535 || n > 65535))
              throw 'x/y invalid.';
            if (0 >= r || 0 >= l || r > 65535 || l > 65535) throw 'Width/Height invalid.';
            if (s.length < r * l) throw 'Not enough pixels for the frame size.';
            var h = !0,
              d = u.palette;
            if (((void 0 === d || null === d) && ((h = !1), (d = f)), void 0 === d || null === d))
              throw 'Must supply either a local or global palette.';
            for (var c = o(d), v = 0; (c >>= 1); ) ++v;
            c = 1 << v;
            var p = void 0 === u.delay ? 0 : u.delay,
              w = void 0 === u.disposal ? 0 : u.disposal;
            if (0 > w || w > 3) throw 'Disposal out of range.';
            var m = !1,
              b = 0;
            if (void 0 !== u.transparent && null !== u.transparent && ((m = !0), (b = u.transparent), 0 > b || b >= c))
              throw 'Transparent color index.';
            if (
              ((0 !== w || m || 0 !== p) &&
                ((e[a++] = 33),
                (e[a++] = 249),
                (e[a++] = 4),
                (e[a++] = (w << 2) | (m === !0 ? 1 : 0)),
                (e[a++] = 255 & p),
                (e[a++] = (p >> 8) & 255),
                (e[a++] = b),
                (e[a++] = 0)),
              (e[a++] = 44),
              (e[a++] = 255 & t),
              (e[a++] = (t >> 8) & 255),
              (e[a++] = 255 & n),
              (e[a++] = (n >> 8) & 255),
              (e[a++] = 255 & r),
              (e[a++] = (r >> 8) & 255),
              (e[a++] = 255 & l),
              (e[a++] = (l >> 8) & 255),
              (e[a++] = h === !0 ? 128 | (v - 1) : 0),
              h === !0)
            )
              for (var y = 0, x = d.length; x > y; ++y) {
                var k = d[y];
                (e[a++] = (k >> 16) & 255), (e[a++] = (k >> 8) & 255), (e[a++] = 255 & k);
              }
            a = i(e, a, 2 > v ? 2 : v, s);
          }),
            (this.end = function () {
              return g === !1 && ((e[a++] = 59), (g = !0)), a;
            });
        }
        function i(e, t, n, r) {
          function i(n) {
            for (; d >= n; ) (e[t++] = 255 & c), (c >>= 8), (d -= 8), t === a + 256 && ((e[a] = 255), (a = t++));
          }
          function o(e) {
            (c |= e << d), (d += h), i(8);
          }
          e[t++] = n;
          var a = t++,
            l = 1 << n,
            f = l - 1,
            s = l + 1,
            u = s + 1,
            h = n + 1,
            d = 0,
            c = 0,
            v = r[0] & f,
            g = {};
          o(l);
          for (var p = 1, w = r.length; w > p; ++p) {
            var m = r[p] & f,
              b = (v << 8) | m,
              y = g[b];
            if (void 0 === y) {
              for (c |= v << d, d += h; d >= 8; )
                (e[t++] = 255 & c), (c >>= 8), (d -= 8), t === a + 256 && ((e[a] = 255), (a = t++));
              4096 === u ? (o(l), (u = s + 1), (h = n + 1), (g = {})) : (u >= 1 << h && ++h, (g[b] = u++)), (v = m);
            } else v = y;
          }
          return o(v), o(s), i(1), a + 1 === t ? (e[a] = 0) : ((e[a] = t - a - 1), (e[t++] = 0)), t;
        }
        function o(e) {
          var t = 0;
          if (71 !== e[t++] || 73 !== e[t++] || 70 !== e[t++] || 56 !== e[t++] || 57 !== e[t++] || 97 !== e[t++])
            throw 'Invalid GIF 89a header.';
          {
            var n = e[t++] | (e[t++] << 8),
              r = e[t++] | (e[t++] << 8),
              i = e[t++],
              o = i >> 7,
              l = 7 & i,
              f = 1 << (l + 1);
            e[t++];
          }
          e[t++];
          var s = null;
          o && ((s = t), (t += 3 * f));
          var u = null,
            h = !0,
            d = [],
            c = 0,
            v = null,
            g = 0,
            u = null;
          for (this.width = n, this.height = r; h && t < e.length; )
            switch (e[t++]) {
              case 33:
                switch (e[t++]) {
                  case 255:
                    if (
                      11 !== e[t] ||
                      (78 == e[t + 1] &&
                        69 == e[t + 2] &&
                        84 == e[t + 3] &&
                        83 == e[t + 4] &&
                        67 == e[t + 5] &&
                        65 == e[t + 6] &&
                        80 == e[t + 7] &&
                        69 == e[t + 8] &&
                        50 == e[t + 9] &&
                        46 == e[t + 10] &&
                        48 == e[t + 11] &&
                        3 == e[t + 12] &&
                        1 == e[t + 13] &&
                        0 == e[t + 16])
                    )
                      (t += 14), (u = e[t++] | (e[t++] << 8)), t++;
                    else
                      for (t += 12; ; ) {
                        var p = e[t++];
                        if (0 === p) break;
                        t += p;
                      }
                    break;
                  case 249:
                    if (4 !== e[t++] || 0 !== e[t + 4]) throw 'Invalid graphics extension block.';
                    var w = e[t++];
                    (c = e[t++] | (e[t++] << 8)), (v = e[t++]), 0 === (1 & w) && (v = null), (g = (w >> 2) & 7), t++;
                    break;
                  case 254:
                    for (;;) {
                      var p = e[t++];
                      if (0 === p) break;
                      t += p;
                    }
                    break;
                  default:
                    throw 'Unknown graphic control label: 0x' + e[t - 1].toString(16);
                }
                break;
              case 44:
                var m = e[t++] | (e[t++] << 8),
                  b = e[t++] | (e[t++] << 8),
                  y = e[t++] | (e[t++] << 8),
                  x = e[t++] | (e[t++] << 8),
                  k = e[t++],
                  I = k >> 7,
                  F = 7 & k,
                  A = 1 << (F + 1),
                  _ = s,
                  G = !1;
                if (I) {
                  var G = !0;
                  (_ = t), (t += 3 * A);
                }
                var P = t;
                for (t++; ; ) {
                  var p = e[t++];
                  if (0 === p) break;
                  t += p;
                }
                d.push({
                  x: m,
                  y: b,
                  width: y,
                  height: x,
                  has_local_palette: G,
                  palette_offset: _,
                  data_offset: P,
                  data_length: t - P,
                  transparent_index: v,
                  delay: c,
                  disposal: g,
                });
                break;
              case 59:
                h = !1;
                break;
              default:
                throw 'Unknown gif block: 0x' + e[t - 1].toString(16);
            }
          (this.numFrames = function () {
            return d.length;
          }),
            (this.frameInfo = function (e) {
              if (0 > e || e >= d.length) throw 'Frame index out of range.';
              return d[e];
            }),
            (this.decodeAndBlitFrameBGRA = function (t, r) {
              var i = this.frameInfo(t),
                o = i.width * i.height,
                l = new Uint8Array(o);
              a(e, i.data_offset, l, o);
              var f = i.palette_offset,
                s = i.transparent_index;
              null === s && (s = 256);
              for (var u = 4 * (n - i.width), h = 4 * (i.y * n + i.x), d = i.width, c = 0, v = l.length; v > c; ++c) {
                var g = l[c];
                if (g === s) h += 4;
                else {
                  var p = e[f + 3 * g],
                    w = e[f + 3 * g + 1],
                    m = e[f + 3 * g + 2];
                  (r[h++] = m), (r[h++] = w), (r[h++] = p), (r[h++] = 255);
                }
                0 === --d && ((h += u), (d = i.width));
              }
            }),
            (this.decodeAndBlitFrameRGBA = function (t, r) {
              var i = this.frameInfo(t),
                o = i.width * i.height,
                l = new Uint8Array(o);
              a(e, i.data_offset, l, o);
              var f = 0,
                s = i.palette_offset,
                u = i.transparent_index;
              null === u && (u = 256);
              for (var h = 4 * (n - i.width), f = 4 * (i.y * n + i.x), d = i.width, c = 0, v = l.length; v > c; ++c) {
                var g = l[c];
                if (g === u) f += 4;
                else {
                  var p = e[s + 3 * g],
                    w = e[s + 3 * g + 1],
                    m = e[s + 3 * g + 2];
                  (r[f++] = p), (r[f++] = w), (r[f++] = m), (r[f++] = 255);
                }
                0 === --d && ((f += h), (d = i.width));
              }
            });
        }
        function a(e, t, n, r) {
          for (
            var i = e[t++],
              o = 1 << i,
              a = o + 1,
              l = a + 1,
              f = i + 1,
              s = (1 << f) - 1,
              u = 0,
              h = 0,
              d = 0,
              c = e[t++],
              v = new Int32Array(4096),
              g = null;
            ;

          ) {
            for (; 16 > u && 0 !== c; ) (h |= e[t++] << u), (u += 8), 1 === c ? (c = e[t++]) : --c;
            if (f > u) break;
            var p = h & s;
            if (((h >>= f), (u -= f), p !== o)) {
              if (p === a) break;
              for (var w = l > p ? p : g, m = 0, b = w; b > o; ) (b = v[b] >> 8), ++m;
              var y = b,
                x = d + m + (w !== p ? 1 : 0);
              if (x > r) return void console.log('Warning, gif stream longer than expected.');
              (n[d++] = y), (d += m);
              var k = d;
              for (w !== p && (n[d++] = y), b = w; m--; ) (b = v[b]), (n[--k] = 255 & b), (b >>= 8);
              null !== g && 4096 > l && ((v[l++] = (g << 8) | y), l >= s + 1 && 12 > f && (++f, (s = (s << 1) | 1))),
                (g = p);
            } else (l = a + 1), (f = i + 1), (s = (1 << f) - 1), (g = null);
          }
          return d !== r && console.log('Warning, gif stream shorter than expected.'), n;
        }
        try {
          (n.GifWriter = r), (n.GifReader = o);
        } catch (l) {}
      },
      {},
    ],
    3: [
      function (e) {
        (function () {
          var t = e('./Animated_GIF');
          'function' == typeof define && define.amd
            ? define(function () {
                return t;
              })
            : (window.Animated_GIF = t);
        }.call(this));
      },
      { './Animated_GIF': 1 },
    ],
  },
  {},
  [3]
);
