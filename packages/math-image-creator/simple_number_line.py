from manim import *

class SimpleNumberLine(Scene):
    def construct(self):
        # Display the title "The super Simple Number Line"
        title = Text("The super Simple Number Line", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Show a basic horizontal line appearing on screen
        number_line = NumberLine(
            x_range=[-5, 5, 1],
            length=10,
            color=BLUE,
            include_numbers=False,
            include_ticks=True,
            tick_size=0.1
        )
        number_line.move_to(ORIGIN)
        
        self.play(Create(number_line))
        self.wait(1)
        
        # Add tick marks and label "0" at the center
        zero_label = Text("0", font_size=36).next_to(number_line.get_center(), DOWN, buff=0.3)
        self.play(Write(zero_label))
        self.wait(1)
        
        # Add text: "A visual tool for understanding numbers and operations."
        description = Text(
            "A visual tool for understanding numbers and operations.",
            font_size=32
        )
        description.next_to(number_line, DOWN, buff=1.5)
        self.play(Write(description))
        self.wait(2)
        
        # Hold the final scene
        self.wait(2)