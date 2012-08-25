---
comments: true
date: 2011-05-18 23:49:05
layout: post
slug: creating-a-lan-wired-lan-using-crossover-cable
title: '[Creating a LAN] Wired LAN using crossover cable'
categories:
- tutorials
- windows
---

Ever wanted to connect your PCs to form a LAN and play your favourite multiplayer game ?If you got stuck creating a LAN, then this tutorial will guide you through. So all you have to do is just follow the steps and you'll be on a LAN in no time.

The tutorial is in 2 parts : **[WIRED](http://kushagragour.in/blog/2011/05/creating-a-lan-wired-lan-using-crossover-cable/)** and **WIRELESS**.
This one will show how to create a wired LAN using just a crossover cable.

So lets get going !

**Requirements for this tutorial :**



	
  * 2 Computer machines having lan card.

	
  * 1 [Crossover cable](http://en.wikipedia.org/wiki/Ethernet_crossover_cable).


[ **NOTE** : The visuals shown here are of Win 7, though it would work just fine on any Windows. ]

**STEP 1 :**
****Connect the 2 machines with the crossover cable.

**STEP 2 :**
On first machine, Open the control Panel and go over to **View network status and tasks**.

[![](/images/lan_1-300x208.png)](/images/lan_1-300x208.png)

**STEP 3 :**
Now click on **Change adapter settings** in the left panel.

[![](/images/lan_2-300x202.png)](/images/lan_2-300x202.png)

**STEP 4 :**

Select the **Local Area Connection** adapter, right-click on it and select **Properties**.

[![](/images/lan_3-300x198.png)](/images/lan_3.png)

**STEP 5 :**

Now we need to edit some IPv4 properties of the connection. Click on **Properties** with **Internet Protocol Version 4 (TCP/IPv4)** selected in the list.

[![](/images/lan_4-300x219.png)](/images/lan_4.png)

**STEP 6 :**

Change the IP addresses to those shown in the picture below and click **OK**.

[![](/images/lan_5-300x229.png)](/images/lan_5.png)

**STEP 7 :**

Follow the same steps on the second machine and change its IP addresses as shown in the picture.

[![](/images/lan_6-300x249.png)](/images/lan_6.png)

This is it ! Your both machines are now connected in a LAN.

You can also set some additional sharing options. For that:

**STEP 8 :**
Click on **Change advanced sharing options** in the **Network and Sharing Center**.

[![](/images/lan_7-300x227.png)](/images/lan_7.png)

Here you can find several sharing options which you can set according to your preferences.

One disadvantage of using a crossover cable to form a LAN is that only 2 machines can be connected together. If you want to go over 2, you will need a switch.

In next tutorial, I shall demonstrate how to form a wireless ad-hoc network using wi-fi which enables more than 2 machines to be connected.

**Stay tuned :)**
