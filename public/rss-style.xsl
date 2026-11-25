<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="tr">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS Akışı</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 2rem 1rem; }
          .container { max-width: 800px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
          .header { border-bottom: 2px solid #b91c1c; padding-bottom: 1.25rem; margin-bottom: 1.5rem; }
          h1 { margin: 0 0 0.5rem 0; font-size: 1.75rem; color: #0f172a; }
          .item { border-bottom: 1px solid #f1f5f9; padding: 1.25rem 0; }
          .item:last-child { border-bottom: none; }
          .item-category { font-size: 0.75rem; font-weight: 700; color: #b91c1c; text-transform: uppercase; margin-bottom: 0.25rem; }
          .item-title { margin: 0 0 0.5rem 0; font-size: 1.2rem; }
          .item-title a { color: #0f172a; text-decoration: none; }
          .item-title a:hover { color: #b91c1c; text-decoration: underline; }
          .item-desc { color: #475569; font-size: 0.92rem; line-height: 1.5; margin: 0 0 0.5rem 0; }
          .item-meta { font-size: 0.8rem; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p class="desc">Son 5 Haber • Günlük Canlı Akış</p>
          </div>
          <div class="items">
            <xsl:for-each select="/rss/channel/item">
              <div class="item">
                <xsl:if test="category">
                  <div class="item-category"><xsl:value-of select="category"/></div>
                </xsl:if>
                <h2 class="item-title">
                  <a target="_blank">
                    <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                    <xsl:value-of select="title"/>
                  </a>
                </h2>
                <p class="item-desc"><xsl:value-of select="description"/></p>
                <div class="item-meta">
                  <span>Yayınlanma: <xsl:value-of select="pubDate"/></span>
                  <xsl:if test="author">
                    <span> • Yazar: <xsl:value-of select="author"/></span>
                  </xsl:if>
                </div>
              </div>
            </xsl:for-each>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
