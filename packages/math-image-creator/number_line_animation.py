from manim import *

class NumberLineAnimation(Scene):
    def construct(self):
        # Create the horizontal number line
        number_line = NumberLine(
            x_range=[-5, 5, 1],
            length=10,
            include_numbers=False,
            include_ticks=True,
            tick_size=0.1,
            stroke_width=3
        )
        
        # Position the number line in the center
        number_line.move_to(ORIGIN)
        
        # Animate the number line extending horizontally
        self.play(Create(number_line), run_time=2)
        self.wait(0.5)
        
        # Highlight the point '0' in the center
        origin_dot = Dot(number_line.number_to_point(0), color=RED, radius=0.1)
        origin_label = Text("Origin", font_size=24, color=RED)
        origin_label.next_to(origin_dot, DOWN, buff=0.3)
        
        self.play(Create(origin_dot), Write(origin_label), run_time=1.5)
        self.wait(0.5)
        
        # Animate numbers appearing to the right: 1, 2, 3...
        positive_numbers = []
        positive_labels = []
        
        for i in range(1, 4):
            # Create dot for each positive number
            dot = Dot(number_line.number_to_point(i), color=BLUE, radius=0.08)
            # Create label for each positive number
            label = Text(str(i), font_size=20, color=BLUE)
            label.next_to(dot, UP, buff=0.2)
            
            positive_numbers.append(dot)
            positive_labels.append(label)
            
            # Animate each number appearing
            self.play(Create(dot), Write(label), run_time=0.8)
            self.wait(0.3)
        
        # Label the positive side
        positive_side_label = Text("Positive Numbers", font_size=28, color=BLUE)
        positive_side_label.move_to([3, -1.5, 0])
        
        self.play(Write(positive_side_label), run_time=1.5)
        self.wait(0.5)
        
        # Show arrow pointing right indicating "Increasing Value"
        arrow = Arrow(
            start=[0.5, 1, 0],
            end=[3, 1, 0],
            color=GREEN,
            stroke_width=4,
            tip_length=0.2
        )
        
        arrow_label = Text("Increasing Value", font_size=24, color=GREEN)
        arrow_label.next_to(arrow, UP, buff=0.1)
        
        self.play(Create(arrow), Write(arrow_label), run_time=2)
        self.wait(2)