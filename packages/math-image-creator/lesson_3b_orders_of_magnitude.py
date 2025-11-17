from manim import *

class OrdersOfMagnitude(Scene):
    def construct(self):
        # Title
        title = Text("Rzędy Wielkości", font_size=48)
        subtitle = Text("Orders of Magnitude", font_size=24, color=GRAY)
        title_group = VGroup(title, subtitle).arrange(DOWN)
        self.play(Write(title), FadeIn(subtitle))
        self.wait(1)
        self.play(FadeOut(title_group))

        # Create initial number line centered on 1
        initial_range = 2
        number_line = NumberLine(
            x_range=[-initial_range, initial_range, 1],
            length=10,
            include_numbers=False
        )
        number_line.move_to(ORIGIN)
        
        # Highlight the center point (1)
        center_dot = Dot(number_line.n2p(1), color=YELLOW, radius=0.1)
        center_label = Text("1", font_size=36, color=YELLOW)
        center_label.next_to(center_dot, UP)
        
        self.play(Create(number_line), FadeIn(center_dot), Write(center_label))
        self.wait(1)

        # Function to create zoom effect
        def zoom_out_to_show(target_value, multiplier_text):
            # Create new number line with extended range
            new_line = NumberLine(
                x_range=[-target_value, target_value, target_value/5],
                length=10,
                include_numbers=False
            )
            new_line.move_to(ORIGIN)
            
            # Create multiplier label
            mult_label = Text(multiplier_text, font_size=36, color=GREEN)
            mult_label.to_edge(UP)
            
            # Animate the transition
            self.play(
                Transform(number_line, new_line),
                center_dot.animate.move_to(new_line.n2p(1)),
                center_label.animate.next_to(new_line.n2p(1), UP),
                Write(mult_label)
            )
            self.wait(0.5)
            self.play(FadeOut(mult_label))
            
            return new_line

        # Zoom out to 10
        self.play(FadeOut(center_label))
        zoom_out_to_show(10, "×10")
        
        # Add marker for 10
        ten_dot = Dot(number_line.n2p(10), color=RED, radius=0.08)
        ten_label = Text("10", font_size=30, color=RED)
        ten_label.next_to(ten_dot, UP)
        self.play(FadeIn(ten_dot), Write(ten_label))
        
        # Zoom out to 100
        self.play(FadeOut(ten_label))
        zoom_out_to_show(100, "×100")
        
        # Add marker for 100
        hundred_dot = Dot(number_line.n2p(100), color=BLUE, radius=0.08)
        hundred_label = Text("100", font_size=30, color=BLUE)
        hundred_label.next_to(hundred_dot, UP)
        self.play(FadeIn(hundred_dot), Write(hundred_label))
        
        # Zoom out to 1000
        self.play(FadeOut(hundred_label))
        zoom_out_to_show(1000, "×1000")
        
        # Add marker for 1000
        thousand_dot = Dot(number_line.n2p(1000), color=PURPLE, radius=0.08)
        thousand_label = Text("1000", font_size=30, color=PURPLE)
        thousand_label.next_to(thousand_dot, UP)
        self.play(FadeIn(thousand_dot), Write(thousand_label))
        
        self.wait(1)
        
        # Now zoom in to show decimals
        zoom_in_text = Text("Teraz w drugą stronę...", font_size=32, color=ORANGE)
        zoom_in_text.to_edge(DOWN)
        self.play(Write(zoom_in_text))
        self.wait(0.5)
        self.play(FadeOut(zoom_in_text), FadeOut(thousand_label))
        
        # Quick zoom back to 1
        centered_line = NumberLine(
            x_range=[-2, 2, 0.5],
            length=10,
            include_numbers=False
        )
        centered_line.move_to(ORIGIN)
        
        self.play(
            Transform(number_line, centered_line),
            center_dot.animate.move_to(centered_line.n2p(1)),
            FadeOut(ten_dot), FadeOut(hundred_dot), FadeOut(thousand_dot),
            run_time=1.5
        )
        
        # Zoom in to show 0.1
        decimal_line = NumberLine(
            x_range=[-0.2, 1.2, 0.1],
            length=10,
            include_numbers=False
        )
        decimal_line.move_to(ORIGIN)
        
        tenth_dot = Dot(decimal_line.n2p(0.1), color=GREEN, radius=0.08)
        tenth_label = Text("0.1", font_size=30, color=GREEN)
        tenth_label.next_to(tenth_dot, DOWN)
        
        div10_label = Text("÷10", font_size=36, color=GREEN)
        div10_label.to_edge(UP)
        
        self.play(
            Transform(number_line, decimal_line),
            center_dot.animate.move_to(decimal_line.n2p(1)),
            Write(div10_label)
        )
        self.play(FadeIn(tenth_dot), Write(tenth_label), FadeOut(div10_label))
        
        # Zoom in to show 0.01
        centesimal_line = NumberLine(
            x_range=[-0.02, 0.12, 0.01],
            length=10,
            include_numbers=False
        )
        centesimal_line.move_to(ORIGIN)
        
        hundredth_dot = Dot(centesimal_line.n2p(0.01), color=ORANGE, radius=0.08)
        hundredth_label = Text("0.01", font_size=30, color=ORANGE)
        hundredth_label.next_to(hundredth_dot, DOWN)
        
        div100_label = Text("÷100", font_size=36, color=ORANGE)
        div100_label.to_edge(UP)
        
        self.play(
            Transform(number_line, centesimal_line),
            center_dot.animate.move_to(centesimal_line.n2p(0.1)),
            tenth_dot.animate.move_to(centesimal_line.n2p(0.1)),
            tenth_label.animate.next_to(centesimal_line.n2p(0.1), UP),
            Write(div100_label)
        )
        self.play(FadeIn(hundredth_dot), Write(hundredth_label), FadeOut(div100_label))
        
        self.wait(1)
        
        # Final view: logarithmic scale
        self.play(
            FadeOut(number_line), FadeOut(center_dot), 
            FadeOut(tenth_dot), FadeOut(tenth_label),
            FadeOut(hundredth_dot), FadeOut(hundredth_label)
        )
        
        # Create logarithmic number line
        log_scale_values = [0.01, 0.1, 1, 10, 100, 1000]
        log_positions = np.log10(log_scale_values)
        
        log_line = NumberLine(
            x_range=[log_positions[0], log_positions[-1], 1],
            length=10,
            include_numbers=False
        )
        log_line.move_to(ORIGIN)
        
        # Add custom labels at logarithmic positions
        log_dots = VGroup()
        log_labels = VGroup()
        colors = [ORANGE, GREEN, YELLOW, RED, BLUE, PURPLE]
        
        for i, (value, pos, color) in enumerate(zip(log_scale_values, log_positions, colors)):
            dot = Dot(log_line.n2p(pos), color=color, radius=0.08)
            label = Text(str(value), font_size=24, color=color)
            label.next_to(dot, DOWN if i < 3 else UP)
            log_dots.add(dot)
            log_labels.add(label)
        
        # Show logarithmic scale
        self.play(Create(log_line))
        self.play(
            LaggedStart(*[FadeIn(dot) for dot in log_dots], lag_ratio=0.1),
            LaggedStart(*[Write(label) for label in log_labels], lag_ratio=0.1)
        )
        
        # Add arrows showing equal spacing
        arrows = VGroup()
        arrow_labels = VGroup()
        for i in range(len(log_positions) - 1):
            arrow = DoubleArrow(
                log_line.n2p(log_positions[i]),
                log_line.n2p(log_positions[i+1]),
                buff=0.5,
                color=GRAY,
                stroke_width=2
            )
            arrow.shift(UP * 0.3 if i >= 2 else DOWN * 0.3)
            arrow_label = Text("×10", font_size=16, color=GRAY)
            arrow_label.move_to(arrow)
            arrows.add(arrow)
            arrow_labels.add(arrow_label)
        
        self.play(
            LaggedStart(*[Create(arrow) for arrow in arrows], lag_ratio=0.1),
            LaggedStart(*[Write(label) for label in arrow_labels], lag_ratio=0.1)
        )
        
        # Final message
        final_message = VGroup(
            Text("Każdy 'krok' to ta sama proporcja (×10),", font_size=28, color=YELLOW),
            Text("a nie ta sama odległość.", font_size=28, color=YELLOW)
        ).arrange(DOWN, buff=0.2)
        final_message.to_edge(DOWN, buff=0.5)
        
        self.play(Write(final_message))
        self.wait(3)