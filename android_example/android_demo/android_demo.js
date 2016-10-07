/*
 * Sakuli - Testing and Monitoring-Tool for Websites and common UIs.
 *
 * Copyright 2013 - 2015 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var andoridSDKBin = "Put your andoird sdk/tools path here"

_dynamicInclude($includeFolder);
var testCase = new TestCase(60, 70);
var env = new Environment();
var region = new Region();
//These two objects are Windows specific
//but it shouldn't be a problem to port it to the desired distribution
var avdNexus7 = new Application(andoridSDKBin + "emulator.exe -avd Nexus7");
var avdNexus7Closeable = new Application("qemu-system-i386.exe");

try {
  //Reduce the similarity, to reduce the amount of errors ;)
  env.setSimilarity(0.95);

  //Start the AndroidVirtualDevice
  avdNexus7.open();
  testCase.endOfStep("StartDevice", 30);

  //Wait for the main menu to be ready, if so lookup the Androidversion
  region.waitForImage("menu.png", 30).highlight().click();
  region.find("settings.png").highlight().click()
  region.find("search.png").highlight().click().type("version")
  region.find("androidVersion.png").highlight().click()
  region.find("7.png").highlight().click()
  region.find("home.png").highlight().click()
  testCase.endOfStep("VersionCheck", 40);

  //Open the browser and open the website "labs.consol.de"
  region.find("browser.png").highlight().click()
  region.find("go.png").type("labs.consol.de").highlight().click()
  //Test if the header has less informations in vertical
  region.find("headerVertical.png").highlight()
  region.find("rotateLeft.png").highlight().click()
  testCase.endOfStep("TestWebpageVertical", 20);
  //give the divice some time to rotate
  env.sleep(1);

  //Test if the header has more informations in horizontal
  region.find("go.png").highlight().click()
  region.find("headerHorizontal.png").highlight()
  testCase.endOfStep("TestWebpageHorizontal", 20);
  env.sleep(2);
} catch (e) {
  testCase.handleException(e);
} finally {
  //Kill the avd service
  avdNexus7Closeable.kill();
  testCase.saveResult();
}
