/*
 *
 *       :::::::::      :::    :::       :::::::::::       :::        :::::::::            ::::::::       :::::::::           :::        ::::::::::   ::::::::::: 
 *      :+:    :+:     :+:    :+:           :+:           :+:        :+:    :+:          :+:    :+:      :+:    :+:        :+: :+:      :+:              :+:      
 *     +:+    +:+     +:+    +:+           +:+           +:+        +:+    +:+          +:+             +:+    +:+       +:+   +:+     +:+              +:+       
 *    +#++:++#+      +#+    +:+           +#+           +#+        +#+    +:+          +#+             +#++:++#:       +#++:++#++:    :#::+::#         +#+        
 *   +#+    +#+     +#+    +#+           +#+           +#+        +#+    +#+          +#+             +#+    +#+      +#+     +#+    +#+              +#+         
 *  #+#    #+#     #+#    #+#           #+#           #+#        #+#    #+#          #+#    #+#      #+#    #+#      #+#     #+#    #+#              #+#          
 * #########       ########        ###########       ########## #########            ########       ###    ###      ###     ###    ###              ###           
 *
 *
 *  This mod is licenced under GPL-3.0 licence
 *  All rights belong to IchZerowan & #mineprogramming
 *  Original CoreEngine source: Zheka Smirnov
 *  Textures and mod design: Nikich21
 * 
 */

var redstoneInverse = __config__.getBool('inverse_redstone');

Recipes.removeFurnaceRecipe(81);
Recipes.addFurnace(81, 351, 2);
