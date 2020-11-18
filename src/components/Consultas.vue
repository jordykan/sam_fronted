<template>

  <v-layout align-start>
      
  <v-flex>
  
      <v-btn @click="listarSolicitudes()" small >Cambios de Guardia</v-btn>
    <br>

  
       <v-dialog v-model="comprobanteModal" max-width="1000px">
            <v-card>
              <v-card-title class="headline">
                  <v-btn @click="crearPDF()"><v-icon>print </v-icon> </v-btn> Reporte de Entrada
              </v-card-title>
              <v-card-text>
                   <div id="solicitudGuardia"> <br><br>
                                  <header>
                          <div id="logo">
                              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACeCAYAAAAbiRdxAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4woSEi8o1K+jsAAAJ0ZJREFUeNrtnXm4XEWZ/z99c7OvJAFCIEDYEpYsIBIwIAgYtt+gI4siDIhCgEFEdBQFERjZ9IcsKjDiIMugIIKiCDJssqpsIQkJIazZSAhLyJ7c3G3++J5z+3R1ne463ed09w31eZ48T253n61OfWt56633BY/H4/F4PB6Px+PxeDyNQK7eN+DJnqn3PxT73Y1HTKn37XlqQHO9b8CTHRaB9wV2BFYDb9X7/jy1wwt9I8Qi8K2BI4DPAZ8EfgV8r9736akdXugbETECPxE4AdiJ/FRtPNAbaKn3PXtqgxf6RoIh8n7AF4FvAbtZfj4a2AR4N8E5u/Dz+u6HF3o3xyLGXYELgH8FesUcNiz4967D+QCagMHACqCj3s/sSY4XejfGEGUzcCxwETK4mSxG4u6NevyhJc4VMgr4FHAomgacCrw19f6H6tqrl1pFCPGjjkK80LspRmXfDPg+MBWJOMo84CbgAeBG4BNI7EMt5wFZ5vcCjgamANuRryf7U2NrvYOoewNDgC3QiOPtWt5fd8ELvRtiVP7dgJ8iUUb5CPgtcB0wJ/jsaST0ZtS7RxkcnOMk4NPAQMulpwC3Ae01ejaTPsDmyMYwFtgFjV62AUYCPwEuy+reujNe6N0MQwhTgKtRhQ9pBx5Blf5xCufUfwPOQHP3UOgD0NLbacBk4uf1AHsgoS3O8Jmi9EciHgfsCUwAdgjuoZ/l96Xu/WONF3o3wRBDE+p5LwNGRD5/Awn/dmCl5TTTgPmoFxwJHIws8weiIXA5RqKh/OJq5+kx4u4BbAlMBPYFJgFjgOHBd+VoqqaMN2a80LsBhij6AN9GDi8Dgs9agN8j4c+J/vjGI6ZEj18E/B0J/cvAyWjIbqMDeBl50U0OPhuAhPd0Cs8R0hvYPrjGQajnHkVlvbN36Y7BC73BMcQxBPhPNPwO390bSOB3AOvDH4a9rXH8IPLz681iLtkGPA/cCvwR2Bm4j/ycfXQV9x/SjIbgByKL/p7ImFYtnSmcY6PEC72BMUSyOXAV6okBWoE/AD8CZkd/aPTiIZOBHyJx2egAnkOW+T8DHwafbwjOv3fw9yjUc5YUVYzARwIHIFfcfYO/K6WD4qF6WxXn26jxQm9QLMtn1wFHBX8vAH4M3AKsDX9Uohc/Hc3FN4+53EzgBuBu4APju+XIiBcKfQs0rC5yn40Rdz9kxPs8cDiaNlRS79YAC9F04lnkGHSy8ZvWKot9o8ULvfEZBPx/JPIO4C/Axciw1kVMLz4++O2R2A1V89EGl1uAd0qc73Hgm2iNfTNkDe8SeozAtwIOAY5BjUScLSCOdmAJMB14Bvgn8CrwfvDdWRQLfX2C83+s8EJvQCLC6YncWU9ES1o/RcJcFf4gphfvCRyHhurbWy6xArgT+DmWYb+FGcCbaM1+GLIVLLMIvBktgR2NevCdSGYJ34Accp4BHkO2ggXYN9/Y6u7aEs/wscYLvcEwxHMa8O/Iq+1iNIfuIkbkWwHnAV9BPXCUNuBR4Eo0HG83z2WePzj3UiS+3VDPvDmFHnIDgP3QLrnPApsmeOQWZFB8HHgIeAH15EU2AON5zbrbiYb3Hgte6I3LQagnvwD4byLr4jECB4nsEuTCavIqcA2yzhessTv2gI8CX0Nz7tBCPgzNu09EPvH9XE6EGpw3kbgfQA2YdSedeW+RZzaX39qJjHQ8hXihNyYDkGPK6Vjm4lAk8sHA14FzKHZtXY7cVn+GxFV0LkeeR8aw0cihZQja5LIn7vVoEfAkWq57Ovi7iOeufaLr/xOnnN/1/+kPXRr9WR/jsFbsTkIevNAblfXIQNZlRS7Ri09AS2xHUDgf7gSeQGvsjxJxhXUVuHGt+WhYPRo4G/XeLvVndXDcvcCDaJhe5CsfFXeEfsinfUnwL4o5LWnBCz0WL/TGpGA9OEbkvdCa+gWo94/yHjK03UB+PbzgXKWwNCbDkNV/YvD3IIdnmAf8FS3ZPY9lWB0j7t7I++4gNC0YjYJomELvb/y9Fi/0WLzQG4w4IRri2xoZ3E6icAjbCTyMevinXc5b4hogb7h/Ac5Efufl/M1bgBeBu9Ay4FsYRrUYcfdEqwOfQeLei7zn3hw0ZYiSI+/+G7I6+Oex4IXe4FjEdwgyuO1pfL4EuBZ5tn0UflihwPsgw97XkSdbOb/zZWh68FtkYFse/fLVe2awctFy85hm1GDtj8T9Keyecq9FnyegB8XbaD/CW91j8UJvYCx+7mchx5VodJh2NPf9EfIY66KcyGPWwfdFAj+M8lb0xWju/T+oJy/wTLP03jnkQrsj8AXg/6HlwFJr7bMo9njrSfH04QO8w0wsXugNiEWAE8kb3KI7tBYh//ebsCy/JbhGDgWk+HcUa25ImcMXouH5bcgltWt4/vzPn6Szo2gJfAvkHXc4mnvfi4bkJ1Fa5B1I6Ca9KRb6UuRw47Hghd5gWAxuxwEXUrhrrA3NgS9BPWkXFfTiO6MQVMcR7wsfMh951N0GvBJ+uGbpKmbfOc387aYohvzhaO69A/kpwEy0qtAJXEHxfDtkOTDX8nlfiofuqQbD2NjwQm8gDBFuCZyP/LmjBrd5yLPtViLGpwoEvg3ynjs5+H8p5qP5923I8aYLY3i+CdrAchjqucdSvN69krx4b0Cjicuxi30xwVq7sYben2Kr+4LKS37jxwu9AbCI8AC0/r1P5LNWtD/8UtQjdlFK5JZzD0XLcmdQGILKRqzAw+tGHFqOBb6LRgil5vbvBucFDc2vR2K/jGKxv06xIQ40bI9eo4VA6N7P3Y4Xep2xJF6YiqLHRIfRb6Jtqb/Bsi3V4bygYfOhaLvqfpSeG89HrrK3EiNwC3OQYbCcAe9NCtf2O9AW3FDs0Z56FvY95ptQ6DCzCmP3nacQL/Q6YohxG7Rx5Xjy76UFOZxcRmRODIlFPgG5xx5N8ZA3ygIk8FtwF3jIy2gacBP5ves2ZgfPxfSHLg1HBB3AL5DYLw3usR3DEBd5ruEULvm9H/zzxOCFXicMMe6L5t2TIp/NRYaqO7GEiHI4J8jp5BTkMz+qxO2EPfhtGDHnyl0zIlZQY3QKEvsky887UYNgO74DefOFPfv6oAzM+TkoIGZ0RLIQY+3eU4iPmlljthg3PirIHJov30FeGOuAm1GwiFuoTOS90DLZvaiHjBP5W8hyfwhKAFEUWNJlzmsIcTba5fac5acrsYwUIsd3oM03PwjOE2dJNx1r3sAnjCyJ79FriCWF0pko2GO4Jjwb9WZ3E1kTTtiLj0NRYo8hfr68CDm53IwMXl2seGcRv5v61cTPZvTsodh/jZbYQpYQGM2M30fpRA5Aq1CADJMcxUJ/FU9JvNBrhKXH/S7yV++LDGy3o6QLTltJYzaenIy82uKWy5YhR5frMYbQaVirDfHOIi/20F33jeAeTJHn0HLiZLTufgDwS+wOMH0oFPp6vNDL4oVeAyxx2S9AQm8GXkK9+J+wbEt1OF8P5Jd+LvIbt8U2X4cCPFyL4roXbBNNc0nKEPvLSOw3IbHPplC8I9CUJRR3mOetA7ujDMhRJpq04kOCfGt+aS0eL/Ta0hdlO/0Omq/ehKK+FOzOStCL74Cs6Sdg3zragYR9DRL6OpfrVIsh9pnIQPcrZKwbjPwDDkOhp3eieNPMMowpRYQw5XPIPOT+6imBF3rGRMTZBy2fnQM8hYxkj+AYEMIQ+QDksvot5H1mYy4aov+GCvakV4sh9hnIr/1otLttDMWBI6IsIlgXDw11kecfSWGj9go+hFRZvNAzxIhv9gPkPXYh2kpaED89QS++D3KoOQzt4jJ5Hy2T3UB1oaOqxhD7HDSqOJrSIgdtTV0e8922xvHTa/pQ3RQv9IwwQjafhiroMSjaShcJBD4Cua2ejj2d0noUi+1qFAO9s9w1aoEh9heRf/1NwO4lDptFfGrmHSL/X43hDuyx44WePePRUPTXRAIjJBim90T7tr+HPbprJ9qHfhUSesGe7EYwUBlif4m8NX6i5edt2LemggyPUaEvQpb8hnjORsYLPVtyaOnHaSuppRcfC/wH8CXsrqvz0BD9FhQnruw16kUJsU8wfvoRgSFu3ox7zNMMRCOjkFkUp5DyWPBCz5aCpAIJevGByJL+LQp7sJAw08rPSOADX28MsU8jv/QWFfsiAo+45UuLlsc3pXAN/R/4xIpOeKFnRIUhlUGx076PdpqZ7ydRppVGxDJnD33jxwefzcUwxEXKaFvyYbRWYXez9VjwQq8TFoFvjoxtZ2A3ts1CDi93UVmmlYbBEPsL5Ifx44Ln7Ig5dAz5QBZvEXjEdbfnrwde6HXA4vN+GOrF97H8/D0kgv8iH7AB6N4V3CL2U5C94ZUSh42L/P9Z/PzcGS/0GmLpxbdH8/B/ozgGWrhc9lMSRnftLhhifw7lcFsWfmcwAEWvAU1ZnnC4hCfAb1OtEYbI+yJPsT+jyKumyJ8Nvj+RjVTkIZYtrktifjqCfIDMxfj5eSJ8j54xMdFevof2i/c2vpuPhug3Y/hvb2wCj1Jiy2q0/HYin475BYJpzMZcLmnihZ4hhsgHoW2k51C8jXQlMrJdi+Es8nGpyJahuslE8g3jIxQndfCUwAs9A2L803+AIrlE85e1o2WyK9GyWdea8MdF4I40owQToCiyfn6eEC/0lDFEPhT5pp9F4R5qkHX5Z8jxpSCSihe5yDV1mZA2BXYN/v8c3u01MV7oKWHpxfdFO9UOojAYxFLksvpfyIW1C19xCzn1vgfD/45BOdpAO+B8fLiEeKGngGUufjpaNovGZl+Loshcg2Ex9gIvy57I138B8Fi9b6Y74oVeBZZefDwK9vgv5Jcu21CgiWuA/8XojbzIy9JMPk783wj22PtyS4YXeoVYvNuORRFkoptQXkJRXu7G8N/2FdWZEWhJshW4h3j3WE8JvNArwBD5cLQufgb58MpvoSgyt2E4gHiBuxEp43FoM8s04Jl631d3xQs9IYbIJ6CcaIcEf3+IYrRdjxHF1Au8YiajenoPgXusL8vkeKE7Ygg8B3wBpfvdEYUw/ivyS38Gx4CPnrL0Q6sX76CsM54K8UJ3wJLx9Gy022wgmodfDfyBSJAJ8CKvlEh5bwfshrLKvAa+TCvFC70MhshHojDNX0HbR69F6+EFKXt9ZUyNfdAuvpvrfSPdHS/0Ehgin4g82fZG88Wf4NfDs6QHcja6Cx/ptWq80C1Y1sePQFFWW9DGlD9Qo6wnHzeMsFFDgB+GH/gyrhwvdAPL+vhUtHT2B+A6FLywC1/5MmMS2q//Wr1vZGPACz2CIfLBKDPpGJSA4e/RL73AM6U3iijz+/ADX97V4YVuZ3OUOuhN5Lrqrem1ZRgK5fw++PJOAy/0YvoDo9C6rbem14eVGAkpPNXhhV5MC4o33hC5yz6mrA7/48s+HbzQi/FRXjwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej+fjS676U1RGXK4tVxxS+HTL56rkGdO4ZhblWel9Neq7rWUZpEG0HOsidMvDD8Qts2s78jvvNB+kEbA8V48KTtMe/cPlGY3rJrlm4mtVWA5NlK9rHUS8ERvt3aZQBgB9gF4OZVEJnShS7jrzi+kPXVp3z7jRaAvofrhV0HYUOvlaoG3ilPMbsUL0REEqvox85jsTHJtDKYF/geP2zEiF6oV2203GLSRyDvgIBXZ4CkVySZMcCgV1HAqiWe63a1CCi4eIuMB2RwyRDwT2B6YAY9GuyKyEvhrVm78CDxOIfuKU8+su9H8DvpPwmJ2Bf9K4oX/3Ae5AYacqZSvgBGBtqcbMqFBTgcsoTsVcjqOBL6HkEmmyZVAOn0xwzLGo4b8l5XupGcY7+RRwAXAA6s1rwYEo1NmdwLkEm4NchstZsqaCYwaj3OKNyvwKnyvKweSzh1oxKtShKM9bUpGDeoIPMiiHD1Hm0yQ0ZXQvNSHyTnLASWg//aHUTuQhfZDYzyfYz1JvoU/HMqdw4DNoz3JdjR0xzAfur/IcA4HPxn1pPPNOKH7d8Crud14G5bAOVfT2BMe8jxEPv5uyB3AF1Y3q0uA4FEW39kI3KukkKuuFxqA8Z43KvcCqKs/xaRRlpRQDUVTacVVcZzaaq2fBY8DrCX7/NkZmm27KlyhOk10PNiXQSU2Fboj8EJRxtJJ76I969UZlBjCnynPsioxZBeVmDA+/gRJJVMN0Us5nFrEpvEMyW8osurkhDo2sDqr3TUToB/Ubum+LeqJhVZxjf8r3eDUlUsFzVL/XfxiGIctoKA8Hvk1173A9apSyogmtBrgyPcN7yZTIu9kFZe9pFFqhhkKPFEQfZDj6ROVnA9Tj7WScu1HYEi2tVUMOWW1tSzHbo4Zykyqv8R7wBmS2bj0YvScXVqNpRHdnEo3TAbUR5KuridANIX4VOD6F0w5DQmgYIs+5E9WLENQYDjXO3Q+lZy63Nu3Cm8DSDMthFLC142FLUBbaRvSNcKUZ2KveNxFhBUGZZr6Oboh8MjL590zp9AeglEhtVZ4nbXYjnbLdFg0DP4x8dirwxZTu82VgbYblMBb3Bu81uvHSWsBw3EYwa9HSYxJnqpBO1NhvQXnHmxcIRmy1dJgZgRw60lxy2AM5l8xrIC+5HgRLGikwGBkd/xn8vR/KxZ7Ge+sk+znxBNxdcmeirLTdjkhnth2qj+X4X5SosxIjaBtyLLqG0kJfgrILrYGMhR4pgGZUQT+d8iW2AnYnm3XgShlCYDtIiUOQy+8g1FCmtWyzkmznxL1wXwJtJ1ujYK3YDS15lmMasLCK62yNfdrdgbTwBPIufDL8IjOhG0P2L6EhpwsfBDf4Ocr3Bj2R9f2PWT1HBc+7FW6tuiu7BP+OQ7nC0+IdggYyo5HQcNwbvI+ofjmyEXCxm7QRaWCTlH1Qx/pRaMhuRWnC/ol83J8CFhAZLdRqU8sEZDzq5/DbTrSh4z7U+7t4e+2LDFbLGmT4Pgb16mmxCXARGranyasEFtk0iTR4o3Gfpi0gyGnXAO+vUvrjNj9fTjBvrpB24FfA4ygHwWvAS2iEUOSFGJZnJkKPvOxN0DLQdo6HPohSE28AXsFtqD8WDREfz+JZKmAclW1PjaMZZXNNmxlka8TcDfdlpjlIAN2ZzVDjVo5FaIdipY1aC9osFIvtvKkL3fDcOgc5drjwFvB98u6YT+Mm9P5ox87jaT9LBfSkOnfUWtFK9nPiJMt/00nZO69WGCOYTR0OeZ2gjmfh/xHXeKQqdOPGj0Qumi57bzvRPLsN9c4rkevketx2/nwGGUGq9S+vlqE0lldUHB8S7HfPaKg8APeVh/Voma+7Mxbo6/C7haiepDXqa0V6aQNpsCY9esCOwCVoeciVr6KtfT1Q734m2uSws8OxuwW/e64e8/RIA7c17vPSeWgYNial2+jA3QFqHkYCyZTZAvfp2vsEG1+68fwc3D0AjwcOI73gEy3I3nIrWrbrsGkgNaFHKnt/4D9Jtpaco9CxYjyqLM/iJvQhaJj/XFrPUyE74964PYsEd24K112B5rmTcKtAr6BeIFUidWBH3IaxIO+8pPvWG42+uDfYmwf/0mQC2vd+LvBL2w9ScYE1huynA8dUecqeyJXw6QTHHEjtN/ibjMe9pX4JLYek4Zl2IxqKu157eg3KwXUzy6yUyqCeDAW2qfM9DAZ+iMKYFc3/qxa6ccIDUauSxvxjMgpC4Jone3cs2zprSG/cRzEbUAWfTvWBFh5EbsCutoG1wbWzogfJDXHdnVHI6l5vRhITfSnNTS2jkOeW65CtHLuiHsq1Um5OfTe5bArs4PjbD9C8dAXyYqqUN1HD2oz7nHhpcFxWc+IhuE23IHvvvFoxHDdDXC2wBnOpSuiRnrM3CoI3KcUbHoY8wlyH7zm04T/NNewkZTAad/fUeeQjqTyMDCpJWYPKfGZQTkMdj3sD91FSJeWwNe5bdBeTrXderVhN42ysGoZlClux0I3h8UnAiRnc9L7IwOYaingvAvfTOgzfd0WGSBdmkV8KfJFk4ZZCfoFCNYPmxK47AmeSfmjnKDvj7hk4l8Kded2VuQSjpAZgMRabR0VCt8R9u4DKYr+V45No+eVtx99vTbLwwmkyMcFvp0f+v5Tkzj5/QQEh29Gw3XVO3EltHGVc69UMgggo3ZwlwM/JtgF15RUsZVrtHH0z4HLS3cQRZTSae7sumzUjg2CtGYD7Ouoaiu0OD+BeSeagnYChn/pQ3Jd2lqOKkBW9cd+x1oZGFxsLNwPfRKOzSvaZp0EHMTaPxOvoxtbTc3EP0rgWDdOSBJ3ogazJT6HpgQuTkWHs/SoLLQkjcPNzBrX+5gjlWdS7lbNxfIASXkRf5jYodJULi9AGkqzmxJvibv1fhhw9uvX8fPpDl4aaaEVr2A8hTeyFOqm4ztR1KTSMPziJ8kE8VhGs4lTlMGMM2Y8FTnM8tBO4ErV6SYf4HyHnmQ9w2822A+pVHs3aS85wEHGNq/46QSMUqSTL0Jx7W+I3gqxEUyQzZnwSJ525ZLtjbTvcDZLzydY7r2ZE3iOoEX8b+DWl9eUq9A7UkD9CeaEvIWafu7PQDZGPR1tPXY1PDwBXU/kOpbVoyOqyVbMfalEfrfBalTAB9wZsJnYr+x2oVx9E8dAvzJP2quW4ibhXmhkkS6iQlHG414lX0PJit6aE0TdHepb4kbh5071BTENeiQvsELT11HXNeB7y2FkOyYdpQUGuBv6B+57s/andJpckDiIdGA4ikd6gHcfNHZFj+uC+W66V7OfESR1l6jWXrZoYgQ9EwTb2QZ3hVVQxPTFCSA9yOGQWMeG4nIRu2Xrquj+6BW1umZb4KYt5Ghk7XFwrd0UGqhdqsMllCO4OItZeuYr72xyFfnYh6x1rA3H3DFxHN92xZhH4JmhUdRDqYKI+DcuRHavaBs2lMe+gRENeVuiWradn4z5UvD34B1RdwWYgY5KLB9gmqPd/oZoLOpZLEgeRhaRgDDPmxK4bJN4mCHiQESORjcGFrL3zasEY5DtyMPE+FAegnnhFFX4dfXCPXBMbjivJ8tpOaMjuaviZhnrzFqj8hUaOW0yykcFnSJYlpFJ2xd1BJO1IKuNwC9EF2e9Y2wl3g2Qm8eSzJvKsw9H+gvOQdT3OLhF1XslV8A+0hO0yaltAYIhLvB898mADgB/hvla8HFmI56VYzm3IL/xox9/vgXqY1zIevu+Oe4M5nXQjqTTS5pEJuC+dTifIoltLD8YU68CBuNmLxqL4bpXuPe9E0wCX5dOSyTJjhW68gDOBoxLc4M/QFkwg1QJ+Bs01XXK2bQHsTTAvzYi+uDuItJDuvHQQ7g1vo+1YG49Ge7XIFNSJXIXT9Aj8NG57KsaQXmCRcrxIiU7EKnRL1tPvOD4YKMrFtQQGiDREHrEyv4Z6A5dslU2o5b2d7OKRjcDdQSTtSCpb4r4H+l2yTXc0FPVernyWEvnfM2AW6Qm9H+4NbK1Yg+IbxFKuRR2Ntp66Zj1diIbsqTtlRB4oyfr43gQOHGkOEY15aRJjWNW5v41ru76XrHesbUN2btDV0k5luwPjGNKAz7qQGI+4kCKhW5L57eF4sQ2oUXg+/CCj3uN5gvmdA9uiOXRWTMQ9qs0sgvQ4KZFkx9rLZLvhYheSxQesJWtJoYGNMJx0EmimyXTKNOQFQjd6vdNQdhBX7kBpYHTllEX+9kvhjkzm4r5M1Bt3X/yk9CBZ6ufpKV67EXespRXsMG0+JN1lxaG4r3TUiicp4/HYJXRD5AejGOuunnMzkVV+PWTTk694v2vL9rskM2rtR7qZU0JcM2dC+rm/k+xYCwNHZkUf3A2S9WAh3T9LayneRZu+SmKbo++BNqC4hoRaiVxca7XxvpVkQSPHoqFlKvP0yDm2x91RZgnpRlLZGvd54iK0gSSrqVQS77x68ArpTpneobGCZTyMg5utTeinkmyp5HqUK41yF0uRJ3A3+A1CrolpMxG3zJkgY1iavcoY3OfEr1JifTUFwpgBjcrz1Z+igLeAe+v9UAEzkT992c0zNqEn2cf9cHChDshe5JHzzyJZVJa9Sd9LLkljOJ90Lb/rcF8ynEm28czWZ3z+alhEstGfC+3I6Py7Oj73emQTOxZH249tDn4rmntORAYWm0N+E+qlvkltAzxEH/RytLy0dcw95pAYXgBuIP2XchNymNkHGeZsW0s7kdvuLSlf+1HgOpTxoznm2h0ole5dyU6dmJfQVO/LyPjZCDvScqiOXE82G3mWoJHvX5Aj2c6oI8n62VejhvtuFOCia/Wp3PPZhP4mcAIy+MRZUnNoC+hy1wtlwAtok02p7XudqCHa4HTGZDwHfA3ZMuL8ETrRkD3N3hxkYPs2cAXxjkwdwbU3QKbvpwXtgbiRZNGDsmZD8Pypic8IMLEKOWPdhbRSixTk65DmCizsLu+2QMiVGqvqmOusLvdZz+vX+9nTuJdas7E+ezfe+efxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDyejYLUI3dedPEl9s8v/EG9n3WjJq7crb+t8F2Uukb0nL4ONB61SIkDJKuInmQkLdss34V/z41JqlExIi95IAozNQrFtvqb43Hlr+HQc5Q6rlRvU64nyroSV9nj9UPhnPbE/l6XA78Hnk3hVg9AyS5nAL8G2i+6+BLz/ndB4Zbmo8yj6xvhPad5nEudiT22BiOwKFmFv/k8cCEKczQWVYhllspg0ofizCc5FOJ5dVhAlnMMQCGdbFORpdjD/Q4Inn95eN6AJhRhdQPxYYJ7oXh1ZhindSg6bRi+KIfCDPUMPo+GtOqBYsO3GcdUygEojtxqlOQiGjxyIIq9Pgk4HIVBqob3gc+hhmUmQeMRKcOewHeBk4D/oDhLzGDsoco6UTy2rt8bghiI4tKZdKDwWrYkBr2C42x1Yy35tMbm/Y+gODRWLriOLaJvH1Sf1lImcGfkOjkUCs0Wgqs9uFYqeQNTE3rk5keg3nwhisB5HHA88PPwdzFi3wX4MTDS8l0r8AsUo8ukD3A1StpnpmpqA84GHrMc9w0U2O8K1NOFDEEBMh9BySJNeqEooEdS+BLCgISXkg/I2ImSVJ4H/AmluNqAGpNvAF9BQS7vTOEVjAju7QbgIvLTshzKsX0ZkQCZ4fuqsLeYjd7nj1Gm3WnoHYUcCByDst/eYhw7GKUS3ovi97UOmIriAZocAZxPcS7yHIqz/jWCRJIRhqPAlba0XD1Q8MjrLd+dhN5ZK4XvuBnVDVt3fDYKKz4VRZ914RSUEckUehNqrE8hEpexGlIRutHqnoiSQJyHhLkncBZwP8UvIspk1NtciYLuh1FUeyJR7RIUgNnCDURpbBcD56LKnCMfmTUuS8mWwX3+Eon7puDczWgUEpdZZSjwr8H1rgyu0YlGFJejSh6NvPrH4DrnoJd2FaqUF6KAivem8Q5QL9uCYr5PDu4ph4J9voOEOQhF9+1ESR/fSXIBY6h6KxLzUcD/oNDf4fs4JyjHqwiSHUSO3QRlz5lGXjBN5N/t6zGXPxJNBS9AI62wh84Fz21LqrBjcH//jTqd6Aisifh3PAm951OQaJuCY5uIF/EOqPFyzcXXG/hicM7LKe40VuCeY7AsaQ/dxwBnkJ+7LQWuQa3m6Wg4F9er90K93X3opQwl33o/Ezx03PC2E72IQUGBLQP+7nC/i9DLvgpVwDBGfUeJa4UvfT7qpaNlaUuWsA6Juj9Kc7Uz6p1uRz1vWskPn0GN6VHAocH9NwHfA25GjdIn0NA+hwTzy6QXiQh2KRrx3IpGJ39HAvwCGl3dAzwQc5p21IAPDu5lKRJ+KZpRD/th5BlA72ohyhhkEgo7HG5Hhb6K+OxC4bsfGNxjO5qelJrytFMm/5lB2BmtD+4tKvS24N5Six5ctdCN+cbpKIPpk2j4Axo+rQ7+vhuFSS5F+DIuQHHL29F8+jE0LGq1HNOOYtFfgSr3Syg/29oSQ9McahDORGK4mPyw0mVelKMw7n0b8Y3LmuAaQ4CTgd8g0a+F1JadPoUE9icKpzgzgjLtjxqdM9FoZF4K17wX+CtqWA5F7/1sNHK5mqARszxfB+r9foLq4OPBca0lyuIpYAoaBUUb4V5oNPMFikdv84AXUeczNfJ5DsXk/zHqTU06UV04l7x9aCrwcopLhOuRkfoMNCKK0gfV36NJKd11mj363igefAswjnyGzU70YjdDc/eTgZYSc/WwVbwOZcPoi0YEI0tcuwfq0U5CgmslFFHpuWgTak2/iVrrc9BwbyDljWOdxm96o+HlEoLsIMZQdwUaxh+NRi3VGsRMwvt+EvWmUYYEz7oe9UwLq7lQ5LlWI0Hvj3r1SWg+fBVKHhFHD9Tbf4O8baMVYt9XDk0NXg/KLWyI29FU6ScoR7sp9GUo/n0ThcPgvmjEuQf26WAONR4noOlm2CkUTFMt99hJYAexWdWN3zehBvnR4JnCutSO6vEpaDpYf6FHHqYv8C1Uoc5GFT26Rt8DGVKOQvPXey2na0PDuSnkRd0RnLs3qghx4suh/F8HBwUV9rYA/8BuGwh/04R63PNQT/R91KLGXasjuMYOqCKEgh+O5py/I5IGyLIEE723NJ1IwhWCk1E+tGjlHYbsDosIK2J6130CLaGeCuyLxHhDWH6W64TPvxUagUQ/60ANlWk7aA7Kdgzq0dcFv29HAm/CPmw+AE0df4d6yLBO9kajxDbis/z0DZ5nh+C4sK68SfzIbQBacVpCoQ1hNlqdiDI4KKdWNMKLCn2L4O8kU4GSpNWjfwINnX+L5oM2I8JlQaF9HqWTWWt8/wJKiHc8xYW/Ac0/bWmV2tEQbQya85p8B7vQP0A9WyiI9cE9rkA9TVwSx4/Q8PhINNyPLqUtCJ6tAKMHfItwqTBdT7EHUQ+xd1DGJnPQtCSVHiLyTG3I0Lc76oGuRum64mgNymAUSrUdEi6jnk6x0FvRHH4ymtJ1Gsc9SpBR1CA0RB5PsbFrLapTNqG/h97zWcb3zWj6+Q/Lce8h+8HXjc97BOVjCn0VmmIegxox83x/JsW87mkJfSaaoy0nELnFAeFF1II3Y0+R9CKyutuWT8L0OjaWo6FOT+wvLS6T6FVofhcdQoeV9i6KG6KQFtTrX0lhzrVwCFoqpe7f0FDTNRNsEhYga35ceqA1ZJdVdRYyMPYi0pDENGTvosptyxkH8e/5evRebDnOlhM0ngZz0Xq/mbar3Lu6Ejn52HLarYm576soth+Ex9gMhW0o3fi1RlmEI5tlNKDVfWXMw0Rb/k5kXS3FR5SpjPfff5/5UQeqPEkpuE7kPjvQ0KsULZRpbWMq+Trc11grYYNLWVxz9U9TuZjxbt8zv4uhjfLla6Od8vXHRmzdLHGvZeuhhUqO2VBhWXg8Ho/H4/F4PJ6Nk/8DbvMBtGWGvV4AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMTAtMThUMTg6NDc6NDArMDA6MDBUgyZfAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTEwLTE4VDE4OjQ3OjQwKzAwOjAwJd6e4wAAAABJRU5ErkJggg==" id="imagen">
                          </div>
                           <div id="logo2">
                             <img id="imagen2" src="data:image/jpeg;base64,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">
                          </div>
                          <div id="datos">
                              <p id="encabezado">
                                  <strong>Solicitud de Entrada</strong><br>
                               

                              </p>
                          </div>
                          <br>
                          <div >

                          </div>
                          <br>
                          <div id="fact">
                          
                            Frontera, Tab. a: {{fecha_real}}
                          </div>
                          <div id="range">
                              Reportes de Solicitudes de Arribo del {{fechaInicial}} al {{fechaFinal}}
                          </div>
                      </header>
                      <br>
                      <section>
                    
                      
                      </section>
                  
                     {{pasa}}

                      <section>
                        
                          <div>
                                <table id="facarticulo" border=".5">
                               <caption id="tituloSolicitante"><strong>Reporte de Cambios de Guardia</strong></caption>
                                  <thead>
                                      <tr id="fa">
                                          <th>Folio</th>
                                          <th>Usuario</th>
                                          <th>Empresa</th>
                                        <th>Numero</th>
                                          <th>Detalles</th>
                                          <th>Embarcacion</th>
                                          <th>Agencia</th>
                                     
                                         
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr v-for="det in cambioGuardia" :key="det._id">   
                                          <td style="text-align:center;" >{{det.agencia.folio}}{{det.folio}}</td>
                                          <td style="text-align:center;">{{det.usuario.nombre}}</td>
                                          <td style="text-align:center;">{{det.usuario.empresa}}</td>
                                         
                                          <td style="text-align:center;">{{det.detalles}}</td>
                                          <td style="text-align:center;">{{det.embarcacion.nombre}}</td>
                                           <td style="text-align:center;">{{det.agencia.nombre}}</td>

                                      </tr>
                                  </tbody>
                                
                              </table>
                              
                             
                          </div>
                      </section>
                   
                  </div>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="ocultarComprobante()" small>Cancelar</v-btn>
              </v-card-actions>
            </v-card>

          </v-dialog>
 
      
 
  </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios';
import DatetimePicker from 'vuetify-datetime-picker'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
export default {
    data(){
        return{
            cambioGuardia:[],
             headers: [
               { text: 'Detalles', value: 'detalles', sortable:true},
               { text: 'Folio', value: 'folio', sortable:true},
               { text: 'Creado', value: 'createdAt', sortable:true},
               { text: 'Embarcacion', value: 'embarcacion.nombre', sortable:true},
             
            ],
            fecha1:'',
            comprobanteModal:0,
            fecha2:'',
            fechaInicial:'',
            fechaFinal:'',
            detalles:'',
            fecha_real:'',
            nombreCompleto:''
        }
    },

    created () {
         
        },

    methods: {

            ocultarComprobante(item){
            this.comprobanteModal=0
          },

            

          listarSolicitudes(){
            let me=this;
            let header={"Token":this.$store.state.token};
            let configuracion= {headers: header}
            var fecha_real = new Date();

            var options = { year: 'numeric', month: 'long', day: 'numeric' };
            this.fecha_real = fecha_real.toLocaleDateString("es-ES", options);
            this.fechaInicial = this.fecha1.toLocaleDateString("es-ES", options)
            this.fechaFinal = this.fecha2.toLocaleDateString("es-ES", options)
            axios.get('cambioGuardia/listFecha?fecha1='+ this.fecha1 +'&fecha2='+this.fecha2,configuracion).then(function (response){
           
            me.cambioGuardia=response.data;
           
            }).catch(function(error){
              console.log(error)
            })
          
            this.comprobanteModal=1        
          },     
    }
}
</script>
<style>
  #factura {
            padding: 20px;
            font-family: Arial, sans-serif;
            font-size: 16px ;
        }

        #logo {
            float: left;
            margin-left: 2%;
            margin-right: 2%;
        }
         #logo2 {
           
            margin-left: 80%;
            margin-right: 2%;
        }
        #table_agencia {
           margin-right: 10px;
        }
        #imagen {
            width: 100px;
        }
         #imagen2{
            width: 90px;
        }

        #fact {
            font-size: 14px;
           
            text-align: right;
        }   

        #datos {
            float: left;
            margin-top: 0%;
            margin-left: 15%;
            margin-right: 2%;
            /*text-align: justify;*/
        }

        #encabezado {
            text-align: center;
            margin-left: 10px;
            margin-right: 10px;
            font-size: 16px;
        }

        section {
            clear: left;
        }

      

        #cliente {
            text-align: left;
        }

        #facliente {
            width: 40%;
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 15px;
        }

        #fa {
            color: #FFFFFF;
            font-size: 14px;
        }

          #fa2 {
            color: #FFFFFF;
            font-size: 14px;
        }

        #facarticulo {
            width: 90%;
            border-collapse: collapse;
            border-spacing: 0;
            padding: 20px;
            margin-bottom: 15px;
            border: .5px solid #ddd;
        }

        #facarticulo thead {
            padding: 20px;
            background: #31467c;
            text-align: center;
            border-bottom: 1px solid #FFFFFF;
        }

         #solicitante {
            width: 60%;
            border-collapse: collapse;
            border-spacing: 1;
            padding: 20px;
            margin-bottom: 15px;
            border: .5px solid #ddd;
        }

         #solicitante thead {
            padding: 20px;
            background: #31467c;
            text-align: center;
            
            border-bottom: 1px solid #FFFFFF;
        }

        #gracias {
            text-align: center;
        }
        #tituloSolicitante{
          background-color: #808285;
          border: 1px solid #ddd;
          color:#FFFFFF
          }
        #tituloPasajeros{
          background-color: #808285;
          border: 1px solid #ddd;
          color:#FFFFFF
       }
</style>