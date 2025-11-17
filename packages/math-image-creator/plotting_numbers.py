from manim import *

class PlottingNumbers(Scene):
    def construct(self):
        # Create the number line
        number_line = NumberLine(
            x_range=[-4, 5, 1],
            length=10,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=24
        )
        
        # Position the number line
        number_line.move_to(ORIGIN)
        
        # Title
        title = Text("Plotting Numbers", font_size=36)
        title.to_edge(UP)
        
        # Animation: Show title and number line
        self.play(Write(title))
        self.play(Create(number_line))
        self.wait(1)
        
        # Plot point at 3 (red dot)
        point_3 = Dot(number_line.number_to_point(3), color=RED, radius=0.1)
        label_3 = Text("Plot 3", font_size=24, color=RED)
        label_3.next_to(point_3, UP, buff=0.3)
        
        self.play(FadeIn(point_3))
        self.play(Write(label_3))
        self.wait(2)
        
        # Plot point at -2 (blue dot)
        point_neg2 = Dot(number_line.number_to_point(-2), color=BLUE, radius=0.1)
        label_neg2 = Text("Plot -2", font_size=24, color=BLUE)
        label_neg2.next_to(point_neg2, UP, buff=0.3)
        
        self.play(FadeIn(point_neg2))
        self.play(Write(label_neg2))
        self.wait(2)
        
        # Plot point at 1.5 (green dot)
        point_1_5 = Dot(number_line.number_to_point(1.5), color=GREEN, radius=0.1)
        label_1_5 = Text("Plot 1.5", font_size=24, color=GREEN)
        label_1_5.next_to(point_1_5, UP, buff=0.3)
        
        self.play(FadeIn(point_1_5))
        self.play(Write(label_1_5))
        self.wait(2)
        
        # Emphasis text
        emphasis = Text("Every number has a unique position", font_size=28, color=YELLOW)
        emphasis.to_edge(DOWN)
        
        self.play(Write(emphasis))
        self.wait(3)
        
        # Highlight each point briefly
        self.play(
            point_3.animate.scale(1.5),
            label_3.animate.set_color(YELLOW)
        )
        self.play(
            point_3.animate.scale(1/1.5),
            label_3.animate.set_color(RED)
        )
        
        self.play(
            point_neg2.animate.scale(1.5),
            label_neg2.animate.set_color(YELLOW)
        )
        self.play(
            point_neg2.animate.scale(1/1.5),
            label_neg2.animate.set_color(BLUE)
        )
        
        self.play(
            point_1_5.animate.scale(1.5),
            label_1_5.animate.set_color(YELLOW)
        )
        self.play(
            point_1_5.animate.scale(1/1.5),
            label_1_5.animate.set_color(GREEN)
        )
        
        self.wait(2)