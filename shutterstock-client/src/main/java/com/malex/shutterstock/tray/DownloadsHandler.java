package com.malex.shutterstock.tray;

import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.handler.AbstractHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;

public class DownloadsHandler extends AbstractHandler
{
    @Override
    public void handle(String s, Request baseRequest,
                       HttpServletRequest request,
                       HttpServletResponse response) throws IOException, ServletException {
        response.setContentType("text/html;charset=utf-8");
        response.setStatus(HttpServletResponse.SC_OK);
        baseRequest.setHandled(true);

        String trayMsg = request.getParameter("tray");
        response.getWriter().println(trayMsg);

        if (trayMsg != null) {
            final SystemTray tray = SystemTray.getSystemTray();
            for (TrayIcon ti : tray.getTrayIcons()) {
                BufferedImage trayImage =
                        new BufferedImage(16, 16,
                                BufferedImage.TYPE_INT_ARGB);
                Graphics2D g2 = trayImage.createGraphics();
                g2.drawString(trayMsg,0,12);
                ti.setImage(trayImage);
            }
        }
    }
}
